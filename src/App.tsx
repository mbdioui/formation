import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Code2,
  Smartphone,
  Users,
  LogIn,
  LogOut,
  ArrowRight,
  LayoutDashboard,
} from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from './firebase';
import { FeatureCard } from './components/FeatureCard';
import { CourseCard } from './components/CourseCard';
import { TestimonialCard } from './components/TestimonialCard';
import { LoginModal } from './components/LoginModal';
import { RegisterModal } from './components/RegisterModal';
import { HeroSection } from './components/HeroSection';
import { WhyUsSection } from './components/WhyUsSection';
import { CoursesSection } from './components/CoursesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CallToActionSection } from './components/CallToActionSection';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';

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
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'admin'>('home');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const q = query(collection(db, 'users'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setIsAdmin(userData.isAdmin === true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setFormData({ name: '', email: '', password: '', formation: '' });
    setErrors({});
    setSubmitSuccess(false);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setFormData({ name: '', email: '', password: '', formation: '' });
    setErrors({});
    setSubmitSuccess(false);
  }, []);

  const openLoginModal = useCallback(() => {
    setIsLoginModalOpen(true);
    setLoginFormData({ email: '', password: '' });
    setLoginError('');
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
    setLoginFormData({ email: '', password: '' });
    setLoginError('');
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActiveTab('home');
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
        isAdmin: formData.email === 'admin@example.com'
      });

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
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('home')}
            className={`text-white hover:text-gray-300 transition-colors ${
              activeTab === 'home' ? 'font-bold border-b-2 border-white pb-1' : ''
            }`}
          >
            Accueil
          </button>
          {currentUser && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`text-white hover:text-gray-300 transition-colors flex items-center ${
                activeTab === 'dashboard' ? 'font-bold border-b-2 border-white pb-1' : ''
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mr-1" />
              Dashboard
            </button>
          )}
          {currentUser && isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`text-white hover:text-gray-300 transition-colors flex items-center ${
                activeTab === 'admin' ? 'font-bold border-b-2 border-white pb-1' : ''
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mr-1" />
              Admin Dashboard
            </button>
          )}
        </nav>

        <div>
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="flex items-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" aria-label="Se déconnecter" />
              Se déconnecter
            </button>
          ) : (
            <button
              onClick={openLoginModal}
              className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              <LogIn className="w-5 h-5 mr-2" aria-label="Se connecter" />
              Se connecter
            </button>
          )}
        </div>
      </div>

      {activeTab === 'home' && (
        <>
          <HeroSection openModal={openModal} />
          <main>
            <WhyUsSection />
            <CoursesSection />
            <TestimonialsSection />
            <CallToActionSection openModal={openModal} />
          </main>
        </>
      )}

      {activeTab === 'dashboard' && currentUser && <Dashboard />}

      {activeTab === 'admin' && currentUser && isAdmin && <AdminDashboard />}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSubmit={handleLoginSubmit}
        formData={loginFormData}
        onChange={handleLoginChange}
        error={loginError}
        isSubmitting={isSubmitting}
      />

      <RegisterModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleChange}
        errors={errors}
        isSubmitting={isSubmitting}
        submitSuccess={submitSuccess}
      />
    </div>
  );
}

export default App;
