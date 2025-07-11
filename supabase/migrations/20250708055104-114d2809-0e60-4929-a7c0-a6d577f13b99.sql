
-- Add password column to agents table
ALTER TABLE public.agents 
ADD COLUMN password TEXT;
