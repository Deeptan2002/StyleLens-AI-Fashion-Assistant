import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import StatsBar from "@/components/landing/StatsBar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <StatsBar />
    </>
  );
}