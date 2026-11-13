// Runs automatically after every Netlify Form submission.
// Adds the person to the matching MailerLite group. The token is read from
// the Netlify environment variable MAILERLITE_TOKEN (never put it in this file).

const API = 'https://connect.mailerlite.com/api';

const GROUP_FOR = {
  'confidence-quiz': { Mind: 'Quiz – Mind', Heart: 'Quiz – Heart', Body: 'Quiz – Body' },
  'confidence-challenge-waitlist': 'Challenge waitlist'
};

async function ml(path, opts = {}) {
  const res = await fetch(API + path, {
    ...opts,
    headers: {
      Authorization: 'Bearer ' + process.env.MAILERLITE_TOKEN,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  });
  const text = await res.text();
  let json = {};
  try { json = JSON.parse(text); } catch (e) {}
  if (!res.ok) throw new Error(path + ' -> ' + res.status + ' ' + text.slice(0, 300));
  return json;
}

// Finds the group by name, or creates it if it does not exist yet.
async function groupId(name) {
  const found = await ml('/groups?limit=100&filter[name]=' + encodeURIComponent(name));
  const hit = (found.data || []).find(g => g.name === name);
  if (hit) return hit.id;
  const made = await ml('/groups', { method: 'POST', body: JSON.stringify({ name }) });
  return made.data.id;
}

exports.handler = async (event) => {
  try {
    if (!process.env.MAILERLITE_TOKEN) {
      console.log('MAILERLITE_TOKEN is not set - skipping MailerLite.');
      return { statusCode: 200, body: 'no token' };
    }
    const payload = JSON.parse(event.body).payload || {};
    const form = payload.form_name;
    const d = payload.data || {};
    const email = (d.email || '').trim();
    if (!email || !GROUP_FOR[form]) return { statusCode: 200, body: 'ignored' };

    let groupName = GROUP_FOR[form];
    if (typeof groupName === 'object') groupName = groupName[d.result];
    if (!groupName) return { statusCode: 200, body: 'no group for result' };

    const id = await groupId(groupName);
    await ml('/subscribers', {
      method: 'POST',
      body: JSON.stringify({
        email,
        fields: { name: (d['first-name'] || '').trim() },
        groups: [id]
      })
    });
    return { statusCode: 200, body: 'added to ' + groupName };
  } catch (err) {
    console.error('MailerLite error:', err.message);
    return { statusCode: 200, body: 'error logged' };
  }
};
