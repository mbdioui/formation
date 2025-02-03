import React from 'react';
import { TestimonialCard } from './TestimonialCard';
import { theme } from '../theme';

export function TestimonialsSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-white text-center mb-12">
        Ce que disent nos étudiants
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <TestimonialCard
          name="Marie L."
          role="Développeuse Junior"
          content="La formation Android m'a permis de décrocher mon premier emploi en tant que développeuse mobile."
          rating={5}
        />
        <TestimonialCard
          name="Thomas B."
          role="Entrepreneur"
          content="Grâce à React Native, j'ai pu créer l'application de ma startup en seulement quelques mois."
          rating={5}
        />
        <TestimonialCard
          name="Sophie M."
          role="Freelance"
          content="Une formation complète et professionnelle qui m'a donné toutes les clés pour réussir."
          rating={5}
        />
      </div>
    </section>
  );
}
