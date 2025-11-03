import { Metadata } from "next";
import React, {
  Suspense,
  //  lazy
} from "react";
import LoadingSpinner from "../../UI/LoadingSpinner";
import { ContactForm, ContactHeroSection, ContactInfo } from "../../components";
import { generateMetadata as generateSEOMetadata } from "../../utils/seo";
import { Breadcrumb } from "../../components/seo/SEOComponents";

export const metadata: Metadata = generateSEOMetadata({
  title: "Contact Us - Espesyal Shop",
  description:
    "Get in touch with Espesyal Shop. We're here to help with any questions about our products, orders, or services. Contact us today!",
  keywords: [
    "contact us",
    "customer service",
    "support",
    "help",
    "questions",
    "inquiry",
    "e-commerce support",
  ],
  canonical: "/contact",
});

const ContactPage = () => {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Contact Us", url: "/contact", current: true },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumb items={breadcrumbItems} />

      {/* Hero Section */}
      <Suspense fallback={<LoadingSpinner />}>
        <ContactHeroSection />
      </Suspense>

      {/* Contact Form and Info Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Suspense fallback={<LoadingSpinner />}>
              <ContactForm />
            </Suspense>

            {/* Contact Information */}
            <ContactInfo />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
