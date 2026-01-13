import { NextResponse } from 'next/server';
import { sql } from '@/utils/neonClient';

// GET /api/users - Fetch all personnel (legacy-compatible route name)
export async function GET() {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const personnel = await sql`
      SELECT id, name, email, role, location, shift, status, created_at, updated_at
      FROM personnel
      ORDER BY created_at DESC
    `;

    const normalized = personnel.map((p: any) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      location: p.location,
      shift: p.shift,
      status: p.status || 'active',
      lastLogin: p.updated_at || p.created_at || null
    }));

    return NextResponse.json(normalized);
  } catch (error) {
    console.error('Error fetching personnel:', error);
    return NextResponse.json(
      { error: 'Failed to fetch personnel' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new personnel record
export async function POST(request: Request) {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      name,
      email,
      role,
      location,
      shift,
      status = 'active'
    } = body;

    const result = await sql`
      INSERT INTO personnel (name, email, role, location, shift, status)
      VALUES (${name}, ${email}, ${role}, ${location}, ${shift}, ${status})
      RETURNING id, name, email, role, location, shift, status, created_at, updated_at
    `;

    const p = result[0];
    const responseBody = {
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      location: p.location,
      shift: p.shift,
      status: p.status || 'active',
      lastLogin: p.updated_at || p.created_at || null
    };

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    console.error('Error creating personnel:', error);
    return NextResponse.json(
      { error: 'Failed to create personnel' },
      { status: 500 }
    );
  }
}

// PATCH /api/users?id=<id> - Update personnel
export async function PATCH(request: Request) {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const body = await request.json();
    const fields = {
      name: body.name,
      email: body.email,
      role: body.role,
      location: body.location,
      shift: body.shift,
      status: body.status
    };

    await sql`
      UPDATE personnel
      SET
        name = COALESCE(${fields.name}, name),
        email = COALESCE(${fields.email}, email),
        role = COALESCE(${fields.role}, role),
        location = COALESCE(${fields.location}, location),
        shift = COALESCE(${fields.shift}, shift),
        status = COALESCE(${fields.status}, status),
        updated_at = NOW()
      WHERE id = ${id}
    `;

    const updated = await sql`
      SELECT id, name, email, role, location, shift, status, created_at, updated_at
      FROM personnel
      WHERE id = ${id}
    `;

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Personnel not found' }, { status: 404 });
    }

    const p = updated[0];
    return NextResponse.json({
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      location: p.location,
      shift: p.shift,
      status: p.status,
      lastLogin: p.updated_at || p.created_at || null
    });
  } catch (error) {
    console.error('Error updating personnel:', error);
    return NextResponse.json(
      { error: 'Failed to update personnel' },
      { status: 500 }
    );
  }
}

// DELETE /api/users?id=<id> - Delete personnel
export async function DELETE(request: Request) {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await sql`DELETE FROM personnel WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting personnel:', error);
    return NextResponse.json(
      { error: 'Failed to delete personnel' },
      { status: 500 }
    );
  }
}
