"use client";
import { Suspense, lazy } from "react";
import {
  // HeroSection,
  MissionSection,
  ValuesSection,
  TeamSection,
  ContactUsSection,
} from "../components";
import LoadingSpinner from "../UI/LoadingSpinner";

const HeroSection = lazy(
  () => import("../components/aboutComponents/HeroSection")
);
// const MissionSection = lazy(
//   () => import("../components/aboutComponents/MissionSection")
// );
// const ValuesSection = lazy(
//   () => import("../components/aboutComponents/ValuesSection")
// );
// const TeamSection = lazy(
//   () => import("../components/aboutComponents/TeamSection")
// );
// const ContactUsSection = lazy(
//   () => import("../components/aboutComponents/ContactUsSection")
// );

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}

      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection />
      </Suspense>

      {/* Mission Section */}
      <Suspense fallback={<LoadingSpinner />}>
        <MissionSection />
      </Suspense>

      {/* Values Section */}
      <Suspense fallback={<LoadingSpinner />}>
        <ValuesSection />
      </Suspense>

      {/* Team Section */}
      <Suspense fallback={<LoadingSpinner />}>
        <TeamSection />
      </Suspense>

      {/* Contact CTA */}
      <Suspense fallback={<LoadingSpinner />}>
        <ContactUsSection />
      </Suspense>
    </div>
  );
};

export default AboutPage;
