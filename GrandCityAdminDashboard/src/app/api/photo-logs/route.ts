import { NextResponse } from 'next/server';
import { sql } from '@/utils/neonClient';

// GET /api/photo-logs - Fetch all photo logs
export async function GET() {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const photoLogs = await sql`SELECT * FROM photo_logs ORDER BY created_at DESC`;
    return NextResponse.json(photoLogs);
  } catch (error) {
    console.error('Error fetching photo logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photo logs' },
      { status: 500 }
    );
  }
}

// POST /api/photo-logs - Create a new photo log
export async function POST(request: Request) {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { project, location, photos, uploaded_by, time, tags } = body;

    const result = await sql`
      INSERT INTO photo_logs (project, location, photos, uploaded_by, time, tags)
      VALUES (${project}, ${location}, ${photos || 0}, ${uploaded_by}, ${time || 'Just now'}, ${tags || []})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating photo log:', error);
    return NextResponse.json(
      { error: 'Failed to create photo log' },
      { status: 500 }
    );
  }
}

// DELETE /api/photo-logs/:id
export async function DELETE(request: Request) {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    await sql`DELETE FROM photo_logs WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting photo log:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo log' },
      { status: 500 }
    );
  }
}
