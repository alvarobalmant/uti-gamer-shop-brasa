
import { useNavigate } from 'react-router-dom';

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  image: string;
  path: string;
}

interface PremiumCategoryCardProps {
  category: CategoryItem;
  index?: number;
}

const PremiumCategoryCard = ({ category, index = 0 }: PremiumCategoryCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(category.path)}
      className="card-category-premium animate-fade-in-premium"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="category-image w-full h-full object-cover transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-white mb-1">{category.name}</h3>
          <p className="text-sm text-white opacity-90 hidden sm:block">{category.description}</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumCategoryCard;
