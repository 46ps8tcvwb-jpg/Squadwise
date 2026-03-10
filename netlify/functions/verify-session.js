const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const sessionId = event.queryStringParameters?.id;
  if (!sessionId) return { statusCode: 400, body: JSON.stringify({ error: 'Missing session id' }) };

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer']
    });

    const active =
      session.payment_status === 'paid' ||
      session.subscription?.status === 'trialing' ||
      session.subscription?.status === 'active';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        active,
        customerId: session.customer?.id || session.customer || '',
        email: session.customer_details?.email || session.customer?.email || ''
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
