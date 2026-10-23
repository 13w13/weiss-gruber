import { createHash } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

// Compteur de visites : une visite par visiteur et par jour, sans cookie.
// Le visiteur est reconnu par une empreinte (IP + navigateur + date) hachée et jamais stockée en clair ;
// elle expire au bout de deux jours. Le total vit dans Redis (Upstash, branché depuis Vercel → Storage).
// Sans base configurée, la route répond { total: null } et le compteur reste masqué.

const REDIS_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const SALT = process.env.VIEWS_SALT ?? 'weiss-gruber';
const TOTAL_KEY = 'views:total';
const BOT_PATTERN = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse/i;

type Command = (string | number)[];

async function redis(commands: Command[]): Promise<{ result: unknown }[]> {
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`Redis ${res.status}`);
  return res.json();
}

function visitorFingerprint(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0].trim() ?? req.socket.remoteAddress ?? '';
  const day = new Date().toISOString().slice(0, 10);
  return createHash('sha256').update(`${SALT}|${day}|${ip}|${req.headers['user-agent'] ?? ''}`).digest('hex').slice(0, 32);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ total: number | null }>) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ total: null });
  }
  if (!REDIS_URL || !REDIS_TOKEN) return res.status(200).json({ total: null });

  try {
    const isBot = BOT_PATTERN.test(req.headers['user-agent'] ?? '');
    if (req.method === 'POST' && !isBot) {
      const [seen] = await redis([['SET', `views:seen:${visitorFingerprint(req)}`, 1, 'NX', 'EX', 172800]]);
      if (seen.result === 'OK') await redis([['INCR', TOTAL_KEY]]);
    }
    const [total] = await redis([['GET', TOTAL_KEY]]);
    return res.status(200).json({ total: Number(total.result ?? 0) });
  } catch (e) {
    console.error('Compteur de visites indisponible :', e);
    return res.status(200).json({ total: null });
  }
}
