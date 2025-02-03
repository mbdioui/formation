import React from 'react';
import { ArrowRight } from 'lucide-react';
import { theme } from '../theme';

interface CallToActionSectionProps {
  openModal: () => void;
}

export function CallToActionSection({ openModal }: CallToActionSectionProps) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Prêt à commencer votre carrière ?
        </h2>
        <p className="text-xl text-white/90 mb-8">
          Inscrivez-vous maintenant et bénéficiez de 30% de réduction sur
          votre première formation
        </p>
        <button
          onClick={openModal}
          className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors flex items-center gap-2 mx-auto"
        >
          S'inscrire maintenant
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
