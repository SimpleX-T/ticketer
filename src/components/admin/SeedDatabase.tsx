import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { seedDatabase } from '../../utils/seedData';
import { toast } from 'react-hot-toast';

export default function SeedDatabase() {
  const { user } = useAuth();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    if (!user?.id) {
      toast.error('You must be logged in to seed the database');
      return;
    }

    try {
      setIsSeeding(true);
      const result = await seedDatabase(user.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred while seeding the database');
      console.error(error);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <button
      onClick={handleSeed}
      disabled={isSeeding}
      className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSeeding ? 'Seeding...' : 'Seed Database'}
    </button>
  );
}
