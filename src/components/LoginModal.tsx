import { X, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: {
    email: string;
    password: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  isSubmitting: boolean;
}

export function LoginModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  error,
  isSubmitting,
}: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Fermer la modal de connexion"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Connexion
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="login-email"
              name="email"
              value={formData.email}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="john@example.com"
              aria-describedby="login-email-error"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="login-password"
              name="password"
              value={formData.password}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              aria-describedby="login-password-error"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center flex items-center justify-center" id="login-error">
              <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors ${
              isSubmitting
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
