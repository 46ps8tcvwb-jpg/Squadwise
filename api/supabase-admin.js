const { createClient } = require('@supabase/supabase-js');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const supabase = createClient(
    'https://wtpvdyeweqxrbvqywecx.supabase.co',
    process.env.SUPABASE_SERVICE_KEY
  );

  try {
    const { action, userId, data } = req.body;
    if (action === 'update_subscription') {
      const { error } = await supabase.from('coach_data').upsert({
        user_id: userId,
        sub_status: 'active',
        customer_id: data.customerId || '',
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
