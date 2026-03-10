const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://wtpvdyeweqxrbvqywecx.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const { action, userId, data } = JSON.parse(event.body);

    if (action === 'update_subscription') {
      // Called after Stripe payment verified — update sub status in DB
      const { error } = await supabase
        .from('coach_data')
        .upsert({
          user_id: userId,
          sub_status: 'active',
          customer_id: data.customerId || '',
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 400, body: JSON.stringify({ error: 'Unknown action' }) };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
