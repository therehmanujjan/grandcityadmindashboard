import { NextResponse } from 'next/server';
import { sql } from '@/utils/neonClient';

// Ensure this route is always dynamic and never cached
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/communications - Fetch all communications
export async function GET() {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const communications = await sql`SELECT * FROM communications ORDER BY created_at DESC`;
    return NextResponse.json(communications, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    console.error('Error fetching communications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch communications' },
      { status: 500 }
    );
  }
}

// POST /api/communications - Create a new communication
export async function POST(request: Request) {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { project, user_name, message } = body;

    // Validate required fields
    if (!project || !user_name || !message) {
      return NextResponse.json(
        { error: 'project, user_name, and message are required' },
        { status: 400 }
      );
    }

    // New messages should be unread by default
    // created_at will be set automatically by the database
    const result = await sql`
      INSERT INTO communications (project, user_name, message, unread)
      VALUES (${project}, ${user_name}, ${message}, ${1})
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create communication' },
        { status: 500 }
      );
    }

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating communication:', error);
    return NextResponse.json(
      { error: 'Failed to create communication' },
      { status: 500 }
    );
  }
}

// PATCH /api/communications?id=:id - Update communication (supports partial updates)
export async function PATCH(request: Request) {
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

    const body = await request.json();
    const { unread } = body;

    // Validate unread value if provided
    if (unread !== undefined && unread !== 0 && unread !== 1) {
      return NextResponse.json(
        { error: 'unread must be 0 or 1' },
        { status: 400 }
      );
    }

    // Update with the provided unread value
    const unreadValue = unread !== undefined ? unread : 0;

    const result = await sql`
      UPDATE communications 
      SET unread = ${unreadValue}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Communication not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating communication:', error);
    return NextResponse.json(
      { error: 'Failed to update communication' },
      { status: 500 }
    );
  }
}

// DELETE /api/communications?id=:id - Delete a communication
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

    const result = await sql`
      DELETE FROM communications 
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Communication not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deleted: result[0] });
  } catch (error) {
    console.error('Error deleting communication:', error);
    return NextResponse.json(
      { error: 'Failed to delete communication' },
      { status: 500 }
    );
  }
}
