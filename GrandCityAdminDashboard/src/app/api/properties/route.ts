import { NextResponse } from 'next/server';
import { sql } from '@/utils/neonClient';
import crypto from 'crypto';

// Admin password hash (SHA-256 of 'admin123')
const ADMIN_PASSWORD_HASH = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3';

function verifyAdminPassword(password: string): boolean {
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  return hash === ADMIN_PASSWORD_HASH;
}

// GET /api/properties - Fetch all properties
export async function GET() {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const properties = await sql`
      SELECT 
        p.*,
        COUNT(DISTINCT ms.id) as maintenance_count,
        COUNT(DISTINCT pp.user_id) as personnel_count
      FROM properties p
      LEFT JOIN maintenance_schedules ms ON p.id = ms.property_id
      LEFT JOIN personnel_properties pp ON p.id = pp.property_id
      GROUP BY p.id
      ORDER BY p.name ASC
    `;
    
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create a new property
export async function POST(request: Request) {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, location, description } = body;

    if (!name || !location) {
      return NextResponse.json(
        { error: 'Name and location are required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO properties (name, location, description)
      VALUES (${name}, ${location}, ${description || ''})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}

// PATCH /api/properties?id=<id> - Update a property
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
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, location, description } = body;

    const result = await sql`
      UPDATE properties
      SET 
        name = COALESCE(${name}, name),
        location = COALESCE(${location}, location),
        description = COALESCE(${description}, description),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

// DELETE /api/properties?id=<id>&password=<password> - Delete a property
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
    const password = searchParams.get('password');

    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid admin password' },
        { status: 403 }
      );
    }

    const result = await sql`
      DELETE FROM properties
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Property deleted successfully',
      property: result[0]
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
