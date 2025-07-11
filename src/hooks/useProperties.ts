
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          agents (
            id,
            name,
            phone,
            email
          )
        `)
        .eq('status', 'vacant')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Properties fetch error:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useAllProperties = () => {
  return useQuery({
    queryKey: ['all-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          agents (
            id,
            name,
            phone,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('All properties fetch error:', error);
        throw error;
      }

      return data || [];
    },
  });
};
