import React from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { theme } from '../theme';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: {
    name: string;
    email: string;
    password: string;
    formation: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors: {
    name?: string;
    email?: string;
    password?: string;
    formation?: string;
    submit?: string;
  };
  isSubmitting: boolean;
  submitSuccess: boolean;
}

export function RegisterModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  errors,
  isSubmitting,
  submitSuccess,
}: RegisterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Fermer la modal d'inscription"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Inscrivez-vous
        </h2>

        {submitSuccess ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Inscription réussie !
            </h3>
            <p className="text-gray-600">
              Vous allez être redirigé vers la page de prise de rendez-vous.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={onChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
                aria-describedby="name-error"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-accentRed flex items-center" id="name-error">
                  <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="john@example.com"
                aria-describedby="email-error"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-accentRed flex items-center" id="email-error">
                  <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                aria-describedby="password-error"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-accentRed flex items-center" id="password-error">
                  <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label>
                Formation souhaitée
              </label>
              <select
                id="formation"
                name="formation"
                value={formData.formation}
                onChange={onChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.formation ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-describedby="formation-error"
              >
                <option value="">Sélectionnez une formation</option>
                <option value="android">Android Natif</option>
                <option value="react-native">React Native</option>
              </select>
              {errors.formation && (
                <p className="mt-1 text-sm text-accentRed flex items-center" id="formation-error">
                  <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                  {errors.formation}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors ${
                isSubmitting
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Inscription en cours...' : "S'inscrire"}
            </button>

            {errors.submit && (
              <p className="text-sm text-accentRed text-center flex items-center justify-center" id="submit-error">
                <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                {errors.submit}
              </p>
            )}

            <p className="text-sm text-gray-500 text-center mt-4">
              En vous inscrivant, vous acceptez nos conditions d'utilisation
              et notre politique de confidentialité
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
