/*
  # Email Verification Functions

  1. New Functions
    - `generate_verification_code`: Generates and stores verification codes
    - `verify_email_code`: Verifies submitted codes
    - `cleanup_expired_verifications`: Removes expired codes

  2. Security
    - Functions are SECURITY DEFINER
    - Public execution permissions granted
*/

-- Create function to generate verification code
CREATE OR REPLACE FUNCTION generate_verification_code(p_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_code text;
BEGIN
  -- Generate a 6-digit code
  v_code := floor(random() * (999999 - 100000 + 1) + 100000)::text;
  
  -- Delete any existing codes for this email
  DELETE FROM email_verifications WHERE email = p_email;
  
  -- Insert new code
  INSERT INTO email_verifications (email, code, expires_at)
  VALUES (p_email, v_code, now() + interval '15 minutes');
  
  RETURN v_code;
END;
$$;

-- Create function to verify code
CREATE OR REPLACE FUNCTION verify_email_code(p_email text, p_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_valid boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM email_verifications
    WHERE email = p_email
    AND code = p_code
    AND expires_at > now()
  ) INTO v_valid;
  
  -- If valid, delete the verification record
  IF v_valid THEN
    DELETE FROM email_verifications WHERE email = p_email;
  END IF;
  
  RETURN v_valid;
END;
$$;

-- Create cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_verifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM email_verifications WHERE expires_at < now();
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION generate_verification_code(text) TO public;
GRANT EXECUTE ON FUNCTION verify_email_code(text, text) TO public;
GRANT EXECUTE ON FUNCTION cleanup_expired_verifications() TO public;
