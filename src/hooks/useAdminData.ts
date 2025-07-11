
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminProperties = () => {
  return useQuery({
    queryKey: ['admin-properties'],
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
        console.error('Admin properties fetch error:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useAdminAgents = () => {
  return useQuery({
    queryKey: ['admin-agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Admin agents fetch error:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Get properties count
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select('status');
      
      if (propError) {
        console.error('Properties stats error:', propError);
        throw propError;
      }

      // Get agents count
      const { data: agents, error: agentError } = await supabase
        .from('agents')
        .select('status');
      
      if (agentError) {
        console.error('Agents stats error:', agentError);
        throw agentError;
      }

      // Get occupants count
      const { data: occupants, error: occError } = await supabase
        .from('occupants')
        .select('status, rent_amount');
      
      if (occError) {
        console.error('Occupants stats error:', occError);
        throw occError;
      }

      const totalProperties = properties?.length || 0;
      const vacantProperties = properties?.filter(p => p.status === 'vacant').length || 0;
      const occupiedProperties = properties?.filter(p => p.status === 'occupied').length || 0;
      const totalAgents = agents?.filter(a => a.status === 'active').length || 0;
      const totalOccupants = occupants?.filter(o => o.status === 'active').length || 0;
      const totalRent = occupants?.filter(o => o.status === 'active')
        .reduce((sum, o) => sum + (o.rent_amount || 0), 0) || 0;

      return {
        totalProperties,
        vacantProperties,
        occupiedProperties,
        totalAgents,
        totalOccupants,
        totalRent
      };
    },
  });
};
