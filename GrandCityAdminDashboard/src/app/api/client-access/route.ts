import { NextResponse } from 'next/server';
import { sql } from '@/utils/neonClient';

// GET /api/client-access - Fetch all client access records
export async function GET() {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const clientAccess = await sql`SELECT * FROM client_access ORDER BY created_at DESC`;
    return NextResponse.json(clientAccess);
  } catch (error) {
    console.error('Error fetching client access:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client access' },
      { status: 500 }
    );
  }
}

// POST /api/client-access - Create a new client access record
export async function POST(request: Request) {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { client, project, last_login, reports_viewed, comments, notifications_enabled, status } = body;

    const result = await sql`
      INSERT INTO client_access (client, project, last_login, reports_viewed, comments, notifications_enabled, status)
      VALUES (${client}, ${project}, ${last_login || 'Just now'}, ${reports_viewed || 0}, ${comments || 0}, ${notifications_enabled ?? true}, ${status || 'Active'})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating client access:', error);
    return NextResponse.json(
      { error: 'Failed to create client access' },
      { status: 500 }
    );
  }
}

// PATCH /api/client-access/:id - Toggle notifications
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

    const result = await sql`
      UPDATE client_access 
      SET notifications_enabled = NOT notifications_enabled, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating client access:', error);
    return NextResponse.json(
      { error: 'Failed to update client access' },
      { status: 500 }
    );
  }
}
