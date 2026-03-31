export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import type { Role } from '../../../../../lib/types';
import { addMessage, listMessages } from '../../../../../lib/server/db';

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  return NextResponse.json(listMessages(ctx.params.id));
}

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const body = (await req.json()) as { role: Role; content: string };
  if (!body?.role || typeof body.content !== 'string') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const msg = addMessage(ctx.params.id, body.role, body.content);
  return NextResponse.json(msg, { status: 201 });
}

