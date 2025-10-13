"use client";
import React, { Suspense, lazy } from "react";
import LoadingSpinner from "../UI/LoadingSpinner";
import { ContactForm, ContactHeroSection } from "../components";

const ContactInfo = lazy(
  () => import("../components/contactComponents/ContactInfo")
);

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
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
            <Suspense fallback={<LoadingSpinner />}>
              <ContactInfo />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
