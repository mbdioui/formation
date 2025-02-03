import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Code2,
  Smartphone,
  Star,
  Users,
  CheckCircle2,
  X,
  AlertCircle,
  LogIn,
  LogOut,
} from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

interface FormData {
  name: string;
  email: string;
  password: string;
  formation: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  formation?: string;
  submit?: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    formation: '',
  });
  const [loginFormData, setLoginFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loginError, setLoginError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    setFormData({ name: '', email: '', password: '', formation: '' });
    setErrors({});
    setSubmitSuccess(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', email: '', password: '', formation: '' });
    setErrors({});
    setSubmitSuccess(false);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setLoginFormData({ email: '', password: '' });
    setLoginError('');
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginFormData({ email: '', password: '' });
    setLoginError('');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, loginFormData.email, loginFormData.password);
      closeLoginModal();
    } catch (error: any) {
      let errorMessage = 'Une erreur est survenue lors de la connexion.';
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Email ou mot de passe incorrect.';
      }
      setLoginError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({ ...prev, [name]: value }));
    setLoginError('');
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password =
        'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (!formData.formation) {
      newErrors.formation = 'Veuillez sélectionner une formation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        name: formData.name,
        email: formData.email,
        formation: formData.formation,
        createdAt: serverTimestamp(),
      });

      // Déconnexion immédiate après la création du compte
      await signOut(auth);

      setSubmitSuccess(true);
      setTimeout(() => {
        window.open('https://calendly.com/bdiouimedsalah', '_blank');
        closeModal();
      }, 2000);
    } catch (error: any) {
      console.error('Error:', error);
      let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Cet email est déjà utilisé.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "L'adresse email est invalide.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "L'inscription par email/mot de passe n'est pas activée.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Le mot de passe est trop faible.';
      }

      setErrors((prev) => ({ ...prev, submit: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-4 flex justify-end">
        {currentUser ? (
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Se déconnecter
          </button>
        ) : (
          <button
            onClick={openLoginModal}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Se connecter
          </button>
        )}
      </div>

      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 animate-gradient"></div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Devenez Développeur Mobile
            </h1>
            <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
              Maîtrisez le développement Android natif et React Native avec des
              formations professionnelles adaptées à tous les niveaux
            </p>
            <button
              onClick={openModal}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 hover:shadow-lg"
            >
              Commencer maintenant
            </button>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BookOpen className="w-8 h-8 text-blue-500" />}
            title="Cours Complets"
            description="Des formations structurées couvrant tous les aspects du développement mobile"
          />
          <FeatureCard
            icon={<Code2 className="w-8 h-8 text-blue-500" />}
            title="Projets Pratiques"
            description="Apprenez en créant des applications concrètes du début à la fin"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-blue-500" />}
            title="Communauté Active"
            description="Rejoignez une communauté de développeurs passionnés"
          />
        </div>
      </section>

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

      <section className="container mx-auto px-4 py-16">
        <div className="bg-blue-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Prêt à commencer votre carrière ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Inscrivez-vous maintenant et bénéficiez de 30% de réduction sur
            votre première formation
          </p>
          <button
            onClick={openModal}
            className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            S'inscrire maintenant
          </button>
        </div>
      </section>

      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-8 relative">
            <button
              onClick={closeLoginModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Connexion
            </h2>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                  value={loginFormData.email}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john@example.com"
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
                  value={loginFormData.password}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>

              {loginError && (
                <p className="text-sm text-red-600 text-center flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {loginError}
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
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-8 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Inscrivez-vous
            </h2>

            {submitSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Inscription réussie !
                </h3>
                <p className="text-gray-600">
                  Vous allez être redirigé vers la page de prise de rendez-vous.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
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
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
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
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="formation"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Formation souhaitée
                  </label>
                  <select
                    id="formation"
                    name="formation"
                    value={formData.formation}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.formation ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionnez une formation</option>
                    <option value="android">Android Natif</option>
                    <option value="react-native">React Native</option>
                  </select>
                  {errors.formation && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
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
                  <p className="text-sm text-red-600 text-center flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
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
      )}
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-slate-800/50 p-8 rounded-xl text-white">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function CourseCard({ title, description, image, features }) {
  return (
    <div className="bg-slate-800/50 rounded-xl overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-8">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-6">{description}</p>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-blue-500 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TestimonialCard({ name, role, content, rating }) {
  return (
    <div className="bg-slate-800/50 p-8 rounded-xl text-white">
      <div className="flex mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        ))}
      </div>
      <p className="text-gray-300 mb-6">{content}</p>
      <div>
        <p className="font-bold">{name}</p>
        <p className="text-gray-400">{role}</p>
      </div>
    </div>
  );
}

export default App;