"use client";

import HeroSection from "../components/HeroSection";
import { useRouter } from "next/navigation";

// Metadata untuk halaman utama akan dihandle oleh layout.js
// Tapi kita bisa menambahkan structured data untuk SEO

export default function Home() {
  const router = useRouter();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Todoriko",
    "alternateName": "Todoriko Todo List App",
    "description": "Todoriko is the best todo list and task management app. Organize your daily tasks, boost productivity, and never miss deadlines.",
    "url": "https://todoriko.xyz",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "Todoriko Team"
    }
  };

  return (
    <div>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HeroSection />
    </div>
  );
}
