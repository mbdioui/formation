import React from 'react';
import { ArrowRight } from 'lucide-react';
import { theme } from '../theme';

interface HeroSectionProps {
  openModal: () => void;
}

export function HeroSection({ openModal }: HeroSectionProps) {
  return (
    <header className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 animate-gradient"></div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-primaryBlue rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primaryPurple rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-secondaryBlue rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-32 flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Devenez Développeur Mobile
          </h1>
          <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
            Maîtrisez le développement Android natif et React Native avec des
            formations professionnelles adaptées à tous les niveaux
          </p>
          <div className="flex justify-center">
            <button
              onClick={openModal}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}