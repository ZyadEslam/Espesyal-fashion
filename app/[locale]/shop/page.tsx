import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generateMetadata as generateSEOMetadata } from "../../utils/seo";
import ShopProductsProvider from "../../components/providers/ShopProductsProvider";
import { fetchInitialProducts } from "./shop-data";
import ShopContent from "./ShopContent";
interface ShopPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: ShopPageProps): Promise<Metadata> {
  const searchParamsData = await searchParams;
  const { category, q } = searchParamsData;
  const t = await getTranslations("shop");
  const tNav = await getTranslations("nav");

  let title = t("title") + " - " + tNav("shop");
  let description = t("defaultDescription");
  let keywords = [
    "shop",
    "products",
    "e-commerce",
    "online shopping",
    "premium goods",
  ];

  if (category) {
    title = `${category.charAt(0).toUpperCase() + category.slice(1)} ${t(
      "products"
    )} - Espesyal Shop`;
    description = t("categoryDescription", { category });
    keywords = [category, "products", "shop", "buy", "premium"];
  }

  if (q) {
    title = `${t("searchResults")} "${q}" - Espesyal Shop`;
    description = t("searchDescription", { query: q });
    keywords = [q, "search", "products", "results"];
  }

  return generateSEOMetadata({
    title,
    description,
    keywords,
    canonical: `/shop${category ? `?category=${category}` : ""}${
      q ? `?q=${q}` : ""
    }`,
  });
}

const ShopPage = async ({ params, searchParams }: ShopPageProps) => {
  const { locale } = await params;
  const searchParamsData = await searchParams;
  const { category, q } = searchParamsData;

  // Use getTranslations for server components
  const t = await getTranslations("shop");
  const tNav = await getTranslations("nav");

  // Prefetch initial products data
  const initialData = await fetchInitialProducts(category);

  const breadcrumbItems = [
    { name: tNav("home"), url: `/${locale}` },
    { name: tNav("shop"), url: `/${locale}/shop`, current: true },
  ];

  if (category) {
    breadcrumbItems.splice(-1, 0, {
      name: category.charAt(0).toUpperCase() + category.slice(1),
      url: `/${locale}/shop?category=${category}`,
    });
  }

  if (q) {
    breadcrumbItems.splice(-1, 0, {
      name: `${t("searchLabel")}: "${q}"`,
      url: `/${locale}/shop?q=${q}`,
    });
  }

  return (
    <ShopProductsProvider
      initialProducts={initialData.products}
      initialPagination={initialData.pagination}
      initialFilters={initialData.filters}
    >
      <ShopContent
        category={category}
        q={q}
        breadcrumbItems={breadcrumbItems}
      />
    </ShopProductsProvider>
  );
};

export default ShopPage;
