import { NextResponse } from 'next/server';
import { sql } from '@/utils/neonClient';

// POST /api/photo-comments - Add a comment to a photo log
export async function POST(request: Request) {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { photo_log_id, user_name, text } = body;

    if (!photo_log_id || !text) {
      return NextResponse.json(
        { error: 'Photo log ID and text are required' },
        { status: 400 }
      );
    }

    const time = new Date().toLocaleString();

    const result = await sql`
      INSERT INTO photo_comments (photo_log_id, user_name, text, time)
      VALUES (${photo_log_id}, ${user_name || 'Admin'}, ${text}, ${time})
      RETURNING id, user_name as user, text, time
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error adding photo comment:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}
