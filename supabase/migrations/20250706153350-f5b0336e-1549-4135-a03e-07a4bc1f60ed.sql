
-- Update RLS policies to allow admin operations

-- First, let's create a more permissive policy for admins to manage agents
DROP POLICY IF EXISTS "Admins can manage agents" ON public.agents;
CREATE POLICY "Admins can manage agents" ON public.agents
  FOR ALL USING (true) WITH CHECK (true);

-- Update properties policies to allow admin operations
DROP POLICY IF EXISTS "Admins can manage all properties" ON public.properties;
CREATE POLICY "Admins can manage all properties" ON public.properties
  FOR ALL USING (true) WITH CHECK (true);

-- Update profiles policies for admin user management
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE USING (true);

CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE USING (true);

-- Also make sure occupants can be managed by admins
DROP POLICY IF EXISTS "Admins can manage all occupants" ON public.occupants;
CREATE POLICY "Admins can manage all occupants" ON public.occupants
  FOR ALL USING (true) WITH CHECK (true);
