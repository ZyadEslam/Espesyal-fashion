import { Metadata } from "next";
// import { Suspense, lazy } from "react";
import {
  HeroSection,
  MissionSection,
  ValuesSection,
  TeamSection,
  ContactUsSection,
} from "../components";
// import LoadingSpinner from "../UI/LoadingSpinner";
import { generateMetadata as generateSEOMetadata } from "../utils/seo";
import { Breadcrumb } from "../components/seo/SEOComponents";

export const metadata: Metadata = generateSEOMetadata({
  title: "About Us - Espesyal Shop",
  description:
    "Learn about Espesyal Shop's mission, values, and team. We're committed to providing premium quality products and exceptional customer service.",
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
  canonical: "/about",
});

const AboutPage = () => {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about", current: true },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumb items={breadcrumbItems} />

      {/* Hero Section */}
      <HeroSection />

      {/* Mission Section */}
      <MissionSection />

      {/* Values Section */}
      <ValuesSection />

      {/* Team Section */}
      <TeamSection />

      {/* Contact CTA */}
      <ContactUsSection />
    </div>
  );
};

export default AboutPage;
