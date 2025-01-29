-- Enable password reset functionality
DO $$
BEGIN
  -- Ensure admin user has confirmed email and proper settings
  UPDATE auth.users
  SET 
    email_confirmed_at = now(),
    raw_app_meta_data = raw_app_meta_data || 
      jsonb_build_object(
        'provider', 'email',
        'providers', array['email']
      ),
    raw_user_meta_data = raw_user_meta_data || 
      jsonb_build_object(
        'allow_password_reset', true
      )
  WHERE email = 'admin@bev.merch.food';

  -- Ensure vendor user has confirmed email and proper settings
  UPDATE auth.users
  SET 
    email_confirmed_at = now(),
    raw_app_meta_data = raw_app_meta_data || 
      jsonb_build_object(
        'provider', 'email',
        'providers', array['email']
      ),
    raw_user_meta_data = raw_user_meta_data || 
      jsonb_build_object(
        'allow_password_reset', true
      )
  WHERE email = 'vendor@example.com';

  -- Grant necessary permissions
  GRANT USAGE ON SCHEMA auth TO anon, authenticated;
  GRANT SELECT ON auth.users TO anon, authenticated;
END $$;

-- Create function to handle password resets
CREATE OR REPLACE FUNCTION handle_password_reset()
RETURNS trigger AS $$
BEGIN
  -- Update user metadata when password is reset
  UPDATE auth.users
  SET
    raw_user_meta_data = raw_user_meta_data || 
      jsonb_build_object('last_password_reset', now())
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for password resets
DROP TRIGGER IF EXISTS on_password_reset ON auth.users;
CREATE TRIGGER on_password_reset
  AFTER UPDATE OF encrypted_password ON auth.users
  FOR EACH ROW
  WHEN (OLD.encrypted_password IS DISTINCT FROM NEW.encrypted_password)
  EXECUTE FUNCTION handle_password_reset();
