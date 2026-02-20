import CTASection from "../../components/CTASection";
import HeroSlider from "./HeroSlider";
import StatsSection from "./StatsSection";
import FeaturesSection from "./FeaturesSection";
import TestimonialsSection from "./TestimonialsSection";
import { useEffect, useState } from "react";
import AmazingLoader from "../../components/WelcomeLodear";

export default function Home() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simulate loading time (you can adjust this or remove it based on actual data loading)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AmazingLoader />;
  }
  return (
    <>
      <HeroSlider />
      <StatsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
