
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePropertyDetail = (propertyId: string) => {
  return useQuery({
    queryKey: ['property-detail', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          agents (
            id,
            name,
            phone,
            email,
            location,
            license_number,
            experience_years
          )
        `)
        .eq('id', propertyId)
        .single();
      
      if (error) {
        console.error('Property detail fetch error:', error);
        throw error;
      }

      return data;
    },
    enabled: !!propertyId,
  });
};
