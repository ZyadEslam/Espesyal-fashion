import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
// import { Suspense, lazy } from "react";
import {
  // HeroSection,
  MissionSection,
  ValuesSection,
  TeamSection,
  ContactUsSection,
} from "../../components";
// import LoadingSpinner from "../UI/LoadingSpinner";
import { generateMetadata as generateSEOMetadata } from "../../utils/seo";
import { Breadcrumb } from "../../components/seo/SEOComponents";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return generateSEOMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: [
      "about us",
      "company",
      "mission",
      "values",
      "team",
      "story",
      "e-commerce",
      "premium products",
    ],
    canonical: `/${locale}/about`,
  });
}

const AboutPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const breadcrumbItems = [
    { name: tNav("home"), url: `/${locale}` },
    { name: t("breadcrumb"), url: `/${locale}/about`, current: true },
  ];

  return (
    <div className="min-h-screen bg-white mx-auto lg:max-w-7xl sm:w-[95%]">
      <Breadcrumb items={breadcrumbItems} />

      {/* Hero Section */}
      {/* <HeroSection /> */}

      {/* Team Section */}
      <TeamSection />

      {/* Mission Section */}
      <MissionSection />

      {/* Values Section */}
      <ValuesSection />

      {/* Contact CTA */}
      <ContactUsSection />
    </div>
  );
};

export default AboutPage;
