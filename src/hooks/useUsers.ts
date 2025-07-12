
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      console.log('Fetching users from Supabase...');
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching users:', error);
          throw error;
        }
        
        console.log('Users fetched successfully:', data);
        
        if (!data) {
          return [];
        }
        
        return data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone || ''
        })) as User[];
      } catch (error) {
        console.error('Failed to fetch users:', error);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
