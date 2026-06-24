// Export every coaching session from Firestore to Markdown files.
//
// Auth: uses Application Default Credentials. Run once first:
//   gcloud auth application-default login
//
// Usage:
//   node scripts/export-sessions.mjs
//
// Output: one .md file per session under coaching-sessions/, plus an index.md.

import { Firestore } from '../server/node_modules/@google-cloud/firestore/build/src/index.js';
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const PROJECT_ID = process.env.GOOGLE_PROJECT_ID || 'compoundingclarity-1054466038518';
// Only export sessions for this user's email. Set ONLY_EMAIL='' to export everyone.
const ONLY_EMAIL = (process.env.ONLY_EMAIL ?? 'phuong.smart@gmail.com').toLowerCase();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../coaching-sessions');

const firestore = new Firestore({ projectId: PROJECT_ID });

function fmt(ts) {
  if (!ts) return '';
  try { return new Date(ts).toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC'); }
  catch { return String(ts); }
}

function slug(s) {
  return String(s).replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 40);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  // Map user ids -> email for nicer labels.
  const usersSnap = await firestore.collection('users').get();
  const users = new Map();
  usersSnap.forEach(d => users.set(d.id, d.data()));

  const sessionsSnap = await firestore.collection('sessions').orderBy('created_at', 'desc').get();

  // Filter to the target user (by email) unless ONLY_EMAIL is empty.
  const allowedUserIds = new Set();
  if (ONLY_EMAIL) {
    for (const [id, u] of users) {
      if ((u.email || '').toLowerCase() === ONLY_EMAIL) allowedUserIds.add(id);
    }
    console.log(`Filtering to ${ONLY_EMAIL} (${allowedUserIds.size} matching user record(s)).`);
  }

  const docs = ONLY_EMAIL
    ? sessionsSnap.docs.filter(d => allowedUserIds.has(d.data().user_id))
    : sessionsSnap.docs;
  console.log(`Found ${sessionsSnap.size} total sessions; ${docs.length} to export.`);

  const index = [];

  for (const doc of docs) {
    const s = doc.data();
    const user = users.get(s.user_id) || {};

    const msgsSnap = await firestore.collection('messages')
      .where('session_id', '==', s.id)
      .orderBy('created_at', 'asc')
      .get();
    const messages = msgsSnap.docs.map(d => d.data());

    const dateStr = (s.created_at || '').slice(0, 10) || 'undated';
    const fileName = `${dateStr}_${slug(s.id)}.md`;

    const lines = [];
    lines.push(`---`);
    lines.push(`session_id: ${s.id}`);
    lines.push(`user: ${user.email || s.user_id}`);
    lines.push(`status: ${s.status || ''}`);
    lines.push(`rating: ${s.rating ?? ''}`);
    lines.push(`created_at: ${s.created_at || ''}`);
    lines.push(`ended_at: ${s.ended_at || ''}`);
    lines.push(`message_count: ${messages.length}`);
    lines.push(`---`);
    lines.push('');
    lines.push(`# Coaching session — ${fmt(s.created_at)}`);
    lines.push('');
    if (messages.length === 0) {
      lines.push('_No messages in this session._');
    }
    for (const m of messages) {
      const who = m.role === 'assistant' ? 'Coach' : 'You';
      lines.push(`### ${who} · ${fmt(m.created_at)}`);
      lines.push('');
      lines.push(m.content || '');
      lines.push('');
    }

    await writeFile(path.join(OUT_DIR, fileName), lines.join('\n'), 'utf8');
    index.push({ fileName, ...s, email: user.email, messageCount: messages.length });
    console.log(`  wrote ${fileName} (${messages.length} messages)`);
  }

  // Index file
  const idx = [];
  idx.push(`# Coaching sessions index`);
  idx.push('');
  idx.push(`Exported ${index.length} sessions from Firestore project \`${PROJECT_ID}\`.`);
  idx.push('');
  idx.push(`| Date | Session | User | Status | Rating | Messages |`);
  idx.push(`|---|---|---|---|---|---|`);
  for (const e of index) {
    idx.push(`| ${(e.created_at || '').slice(0, 10)} | [${e.id.slice(0, 8)}](${e.fileName}) | ${e.email || e.user_id} | ${e.status || ''} | ${e.rating ?? ''} | ${e.messageCount} |`);
  }
  await writeFile(path.join(OUT_DIR, 'index.md'), idx.join('\n'), 'utf8');

  console.log(`\nDone. ${index.length} sessions written to ${OUT_DIR}`);
}

main().catch(err => { console.error(err); process.exit(1); });
