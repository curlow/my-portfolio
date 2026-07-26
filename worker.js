export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
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
        return new Response('Telegram error', { status: 500 });
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (err) {
      return new Response('Error: ' + err.message, { status: 500 });
    }
  }
};
