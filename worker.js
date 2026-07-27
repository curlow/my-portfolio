export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const data = await request.json();

      const name = data.name || 'Не указано';
      const contact = data.contact || 'Не указано';
      const message = data.message || 'Пустое сообщение';

      const text = '📩 *Новая заявка с сайта*\n\n'
        + '👤 *Имя:* ' + name + '\n'
        + '📡 *Контакт:* ' + contact + '\n\n'
        + message;

      const tgResponse = await fetch(
        'https://api.telegram.org/bot' + env.BOT_TOKEN + '/sendMessage',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: env.CHAT_ID,
            text: text,
            parse_mode: 'Markdown'
          })
        }
      );

      if (!tgResponse.ok) {
        return new Response('Telegram error', { status: 500, headers: corsHeaders });
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });

    } catch (err) {
      return new Response('Error: ' + err.message, { status: 500, headers: corsHeaders });
    }
  }
};
