import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
}

export function TestimonialCard({ name, role, content, rating }: TestimonialCardProps) {
  return (
    <div className="bg-slate-800/50 p-8 rounded-xl text-white">
      <div className="flex mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" aria-hidden="true" />
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
