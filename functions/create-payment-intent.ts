import { Config, Context } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(Netlify.env.get("STRIPE_SECRET_KEY") || '', {
  apiVersion: '2023-10-16',
});

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 200, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers
    });
  }

  try {
    const { amount } = await req.json();

    if (!amount) {
      return new Response(JSON.stringify({ error: 'Amount is required' }), {
        status: 400,
        headers
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return new Response(JSON.stringify({
      clientSecret: paymentIntent.client_secret
    }), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Failed to create payment intent'
    }), {
      status: 500,
      headers
    });
  }
};

export const config: Config = {
  path: "/.netlify/functions/create-payment-intent"
};
