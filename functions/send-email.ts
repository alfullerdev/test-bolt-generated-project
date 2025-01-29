import { Config, Context } from '@netlify/functions';
import { Resend } from 'resend';

const resend = new Resend(Netlify.env.get("RESEND_API_KEY"));

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

export default async (req: Request, context: Context) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers
    });
  }

  try {
    if (!Netlify.env.get("RESEND_API_KEY")) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const body = await req.json();
    const { to, subject, html, text } = body;
    
    if (!to) {
      return new Response(JSON.stringify({ error: 'Recipient email is required' }), {
        status: 400,
        headers
      });
    }

    const result = await resend.emails.send({
      from: 'Bev.Merch.Food <accounts@bev.merch.food>',
      to: [to],
      subject: subject || 'Message from Bev.Merch.Food',
      html: html || '<p>Test email from Bev.Merch.Food</p>',
      text: text
    });

    // Handle Resend error response
    if ('error' in result && result.error) {
      return new Response(JSON.stringify({
        error: result.error.message || 'Failed to send email'
      }), {
        status: 500,
        headers
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: result
    }), {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Failed to send email:', error);

    // Ensure we always return a proper error message
    const errorMessage = error instanceof Error ? error.message : 'Failed to send email';
    
    return new Response(JSON.stringify({
      error: errorMessage
    }), {
      status: 500,
      headers
    });
  }
};

export const config: Config = {
  path: "/.netlify/functions/send-email"
};
