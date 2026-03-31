export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { listConversations } from '../../../lib/server/db';

export async function GET() {
  return NextResponse.json(listConversations());
}