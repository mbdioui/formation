import { CheckCircle2 } from 'lucide-react';
import { theme } from '../theme';

interface CourseCardProps {
  title: string;
  description: string;
  image: string;
  features: string[];
}

export function CourseCard({ title, description, image, features }: CourseCardProps) {
  return (
    <div className="bg-slate-800/50 rounded-xl overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-8">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-6">{description}</p>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-primaryBlue mr-2" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
