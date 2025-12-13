import React from 'react';
import { useApp } from '../context/AppContext';
import { HeroSection } from '../components/home/HeroSection';
import { QuickCalculator } from '../components/home/QuickCalculator';
import { FeaturesSection } from '../components/home/FeaturesSection';

export const HomePage: React.FC = () => {
  const { user } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <HeroSection />
      <QuickCalculator isAuthenticated={!!user} />
      <FeaturesSection />
    </div>
  );
};
