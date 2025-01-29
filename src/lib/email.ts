import { supabase } from './supabase';

interface SendEmailParams {
  to: string;
  subject?: string;
  html?: string;
  text?: string;
}

export const sendEmail = async (params: SendEmailParams) => {
  if (!params.to) {
    throw new Error('Recipient email is required');
  }

  try {
    const response = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to send email: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error instanceof Error ? error : new Error('Failed to send email');
  }
};

export const sendVerificationEmail = async (email: string): Promise<string> => {
  try {
    // Generate verification code using our database function
    const { data, error: dbError } = await supabase
      .rpc('generate_verification_code', { p_email: email });

    if (dbError) throw dbError;

    const verificationCode = data;

    // Send email with the code
    await sendEmail({
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #FF512F;">Verify Your Email</h1>
          <p>Please use the following code to verify your email address:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${verificationCode}</span>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    });

    return verificationCode;
  } catch (error) {
    console.error('Verification email error:', error);
    throw error instanceof Error ? error : new Error('Failed to send verification email');
  }
};

export const verifyEmailCode = async (email: string, code: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('verify_email_code', {
        p_email: email,
        p_code: code
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Code verification error:', error);
    throw error instanceof Error ? error : new Error('Failed to verify code');
  }
};
