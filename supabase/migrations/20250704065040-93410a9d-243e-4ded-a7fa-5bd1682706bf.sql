
-- Create a table to store occupants/tenants
CREATE TABLE public.occupants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  rent_amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on occupants table
ALTER TABLE public.occupants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for occupants
CREATE POLICY "Agents can manage occupants for their properties" ON public.occupants
  FOR ALL USING (
    property_id IN (
      SELECT id FROM public.properties WHERE agent_id IN (
        SELECT id FROM public.agents WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can manage all occupants" ON public.occupants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Add some sample data for testing
INSERT INTO public.agents (name, email, phone, location, user_id) VALUES 
('John Kamau', 'john.kamau@example.com', '+254712345678', 'Nairobi', null);

-- Get the agent ID for sample properties
DO $$
DECLARE
    agent_uuid UUID;
BEGIN
    SELECT id INTO agent_uuid FROM public.agents WHERE email = 'john.kamau@example.com' LIMIT 1;
    
    -- Insert sample properties
    INSERT INTO public.properties (agent_id, title, description, location, bedrooms, bathrooms, price, property_type, status, images) VALUES 
    (agent_uuid, 'Sunset Apartments Block A', 'Modern 2-bedroom apartment with parking and backup generator', 'Westlands, Nairobi', 2, 2, 25000, 'apartment', 'vacant', ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400']),
    (agent_uuid, 'Garden View Villa', 'Spacious villa with garden and swimming pool access', 'Karen, Nairobi', 3, 3, 45000, 'villa', 'occupied', ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400']),
    (agent_uuid, 'City Heights Studio', 'Modern studio apartment in the heart of the city', 'CBD, Nairobi', 1, 1, 18000, 'studio', 'vacant', ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400']),
    (agent_uuid, 'Riverside Mansion', 'Luxury 4-bedroom mansion with river view', 'Kileleshwa, Nairobi', 4, 4, 65000, 'house', 'maintenance', ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400']);
    
    -- Insert sample occupants
    INSERT INTO public.occupants (property_id, name, email, phone, start_date, rent_amount, status) 
    SELECT p.id, 'Jane Smith', 'jane.smith@example.com', '+254701234567', '2024-01-15', p.price, 'active'
    FROM public.properties p WHERE p.title = 'Garden View Villa' AND p.agent_id = agent_uuid;
END $$;

-- Create indexes for better performance
CREATE INDEX idx_occupants_property_id ON public.occupants(property_id);
CREATE INDEX idx_occupants_status ON public.occupants(status);
