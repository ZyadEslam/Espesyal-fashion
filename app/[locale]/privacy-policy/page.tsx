import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "../../components/seo/SEOComponents";
import { generateMetadata as generateSEOMetadata } from "../../utils/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  return generateSEOMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: [
      "privacy policy",
      "data protection",
      "personal information",
      "women's fashion",
      "e-commerce",
    ],
    canonical: `/${locale}/privacy-policy`,
  });
}

const PrivacyPolicyPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const breadcrumbItems = [
    { name: tNav("home"), url: `/${locale}` },
    { name: t("breadcrumb"), url: `/${locale}/privacy-policy`, current: true },
  ];

  const sections = [
    "intro",
    "infoWeCollect",
    "howWeUse",
    "dataSharing",
    "cookies",
    "dataRetention",
    "yourRights",
    "security",
    "children",
    "changes",
    "contact",
  ] as const;

  return (
    <div className="min-h-screen bg-white mx-auto lg:max-w-4xl sm:w-[95%] px-4 sm:px-0">
      <Breadcrumb items={breadcrumbItems} />

      <article className="py-12 pb-20">
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-sm text-gray-500">{t("lastUpdated")}</p>
        </header>

        <div className="prose prose-gray max-w-none space-y-10">
          {sections.map((section) => (
            <section key={section}>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {t(`sections.${section}.title`)}
              </h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {t(`sections.${section}.content`)}
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
};

export default PrivacyPolicyPage;
