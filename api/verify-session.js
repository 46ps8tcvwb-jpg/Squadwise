const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const sessionId = req.query.id;
  if (!sessionId) return res.status(400).json({ error: 'Missing session id' });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer']
    });
    const active =
      session.payment_status === 'paid' ||
      session.subscription?.status === 'trialing' ||
      session.subscription?.status === 'active';
    return res.status(200).json({
      active,
      customerId: session.customer?.id || session.customer || '',
      email: session.customer_details?.email || session.customer?.email || ''
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
