"use client";

import HeroSection from "../components/HeroSection";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <HeroSection />{" "}
    </div>
  );
}
