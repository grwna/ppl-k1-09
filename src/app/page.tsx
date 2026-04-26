import { Navbar } from "@/components/ui/navbar";
import { CallToAction } from "@/components/ui/landing/CallToAction";
import { Hero } from "@/components/ui/landing/Hero";
import { HowItWorks } from "@/components/ui/landing/HowItWorks";
import { ImpactStats } from "@/components/ui/landing/ImpactStats";
import { TrustTransparency } from "@/components/ui/landing/TrustTransparency";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      <ImpactStats />
      <TrustTransparency />
      <CallToAction />

      <section id="faq" className="sr-only" aria-hidden="true">
        FAQ Anchor
      </section>
    </main>
  );
}
