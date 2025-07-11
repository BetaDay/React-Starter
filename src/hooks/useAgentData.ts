
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Get current agent from localStorage
const getCurrentAgent = () => {
  const agentSession = localStorage.getItem('agentSession');
  return agentSession ? JSON.parse(agentSession) : null;
};

export const useAgentProperties = () => {
  return useQuery({
    queryKey: ['agent-properties'],
    queryFn: async () => {
      const currentAgent = getCurrentAgent();
      if (!currentAgent) {
        console.log('No agent session found');
        return [];
      }

      console.log('Fetching properties for agent:', currentAgent.id);

      // Get properties for this agent
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('agent_id', currentAgent.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Properties fetch error:', error);
        throw error;
      }

      console.log('Agent properties:', data);
      return data || [];
    },
  });
};

export const useAgentOccupants = () => {
  return useQuery({
    queryKey: ['agent-occupants'],
    queryFn: async () => {
      const currentAgent = getCurrentAgent();
      if (!currentAgent) {
        return [];
      }

      // First get property IDs for this agent
      const { data: agentProperties, error: propError } = await supabase
        .from('properties')
        .select('id')
        .eq('agent_id', currentAgent.id);

      if (propError) {
        console.error('Properties fetch error:', propError);
        throw propError;
      }

      if (!agentProperties || agentProperties.length === 0) {
        return [];
      }

      const propertyIds = agentProperties.map(p => p.id);

      // Now get occupants for these properties
      const { data, error } = await supabase
        .from('occupants')
        .select(`
          *,
          properties (
            id,
            title,
            location,
            property_type
          )
        `)
        .eq('status', 'active')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Occupants fetch error:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useAgentStats = () => {
  return useQuery({
    queryKey: ['agent-stats'],
    queryFn: async () => {
      const currentAgent = getCurrentAgent();
      if (!currentAgent) {
        return {
          totalProperties: 0,
          vacantProperties: 0,
          occupiedProperties: 0,
          totalOccupants: 0,
          totalRent: 0
        };
      }

      // Get properties count for this agent
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select('status')
        .eq('agent_id', currentAgent.id);
      
      if (propError) {
        console.error('Properties stats error:', propError);
        throw propError;
      }

      // Get property IDs for this agent
      const { data: agentProperties, error: agentPropError } = await supabase
        .from('properties')
        .select('id')
        .eq('agent_id', currentAgent.id);

      if (agentPropError) {
        console.error('Agent properties fetch error:', agentPropError);
        throw agentPropError;
      }

      let occupants = [];
      if (agentProperties && agentProperties.length > 0) {
        const propertyIds = agentProperties.map(p => p.id);

        // Get occupants count for this agent's properties
        const { data: occupantsData, error: occError } = await supabase
          .from('occupants')
          .select('status, rent_amount')
          .in('property_id', propertyIds);
        
        if (occError) {
          console.error('Occupants stats error:', occError);
          throw occError;
        }

        occupants = occupantsData || [];
      }

      const totalProperties = properties?.length || 0;
      const vacantProperties = properties?.filter(p => p.status === 'vacant').length || 0;
      const occupiedProperties = properties?.filter(p => p.status === 'occupied').length || 0;
      const totalOccupants = occupants?.filter(o => o.status === 'active').length || 0;
      const totalRent = occupants?.filter(o => o.status === 'active')
        .reduce((sum, o) => sum + (o.rent_amount || 0), 0) || 0;

      return {
        totalProperties,
        vacantProperties,
        occupiedProperties,
        totalOccupants,
        totalRent
      };
    },
  });
};
