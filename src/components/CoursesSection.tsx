import React from 'react';
import { CourseCard } from './CourseCard';
import { theme } from '../theme';

export function CoursesSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-white text-center mb-12">
        Nos Formations
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        <CourseCard
          title="Android Natif"
          description="Maîtrisez le développement Android avec Kotlin"
          image="https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
          features={[
            'Bases de Kotlin',
            'Interface utilisateur native',
            'Gestion des données',
            'Publication sur le Play Store',
          ]}
        />
        <CourseCard
          title="React Native"
          description="Créez des applications multiplateformes"
          image="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
          features={[
            'JavaScript/TypeScript moderne',
            'Components React Native',
            'Navigation et state management',
            'Déploiement iOS & Android',
          ]}
        />
      </div>
    </section>
  );
}
