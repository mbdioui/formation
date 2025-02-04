import React from 'react';
import { BookOpen, Code2, Users } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { theme } from '../theme';

export function WhyUsSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-white text-center mb-12">
        Pourquoi choisir nos formations ?
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<BookOpen className="w-8 h-8 text-primaryBlue" />}
          title="Cours Complets"
          description="Des formations structurées couvrant tous les aspects du développement mobile"
        />
        <FeatureCard
          icon={<Code2 className="w-8 h-8 text-primaryBlue" />}
          title="Projets Pratiques"
          description="Apprenez en créant des applications concrètes du début à la fin"
        />
        <FeatureCard
          icon={<Users className="w-8 h-8 text-primaryBlue" />}
          title="Communauté Active"
          description="Rejoignez une communauté de développeurs passionnés"
        />
      </div>
    </section>
  );
}
