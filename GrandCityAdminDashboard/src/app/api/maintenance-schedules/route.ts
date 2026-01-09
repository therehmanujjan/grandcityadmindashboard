import { NextResponse } from 'next/server';
import { sql } from '@/utils/neonClient';
import crypto from 'crypto';

// Admin password hash (SHA-256 of 'admin123')
const ADMIN_PASSWORD_HASH = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3';

function verifyAdminPassword(password: string): boolean {
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  return hash === ADMIN_PASSWORD_HASH;
}

// GET /api/maintenance-schedules - Fetch all maintenance schedules
export async function GET(request: Request) {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const propertyId = searchParams.get('propertyId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let queryStr = `
      SELECT 
        ms.*,
        p.name as property_name,
        p.location as property_location,
        v.name as vendor_name,
        v.category as vendor_category
      FROM maintenance_schedules ms
      LEFT JOIN properties p ON ms.property_id = p.id
      LEFT JOIN vendors v ON ms.vendor_id = v.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIdx = 1;

    // Apply filters
    if (status && status !== 'all') {
      queryStr += ` AND ms.status = $${paramIdx++}`;
      params.push(status);
    }

    if (propertyId) {
      queryStr += ` AND ms.property_id = $${paramIdx++}`;
      params.push(propertyId);
    }

    if (startDate) {
      queryStr += ` AND ms.date >= $${paramIdx++}`;
      params.push(startDate);
    }

    if (endDate) {
      queryStr += ` AND ms.date <= $${paramIdx++}`;
      params.push(endDate);
    }

    queryStr += ` ORDER BY ms.date DESC, ms.created_at DESC`;

    // Clean up query string to avoid whitespace issues
    queryStr = queryStr.replace(/\s+/g, ' ').trim();
    console.log('Executing query:', queryStr);
    console.log('Params:', params);

    const schedules = await sql(queryStr, params);

    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error fetching maintenance schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maintenance schedules' },
      { status: 500 }
    );
  }
}

// POST /api/maintenance-schedules - Create a new maintenance schedule
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
      property_id,
      date,
      type,
      vendor_id,
      vendor_name,
      status = 'pending',
      requested_time,
      start_time,
      end_time,
      description,
      priority = 'Normal',
      acknowledgments = {}
    } = body;

    if (!property_id || !date || !type || !requested_time) {
      return NextResponse.json(
        { error: 'Property, date, type, and requested time are required' },
        { status: 400 }
      );
    }

    // Get vendor name if vendor_id is provided
    let finalVendorName = vendor_name || 'Not assigned';
    if (vendor_id && !vendor_name) {
      const vendor = await sql`SELECT name FROM vendors WHERE id = ${vendor_id}`;
      if (vendor.length > 0) {
        finalVendorName = vendor[0].name;
      }
    }

    const result = await sql`
      INSERT INTO maintenance_schedules (
        property_id, date, type, vendor_id, vendor_name, status,
        requested_time, start_time, end_time, description, priority, acknowledgments
      )
      VALUES (
        ${property_id}, ${date}, ${type}, ${vendor_id}, ${finalVendorName}, ${status},
        ${requested_time}, ${start_time}, ${end_time}, ${description}, ${priority}, ${JSON.stringify(acknowledgments)}
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating maintenance schedule:', error);
    return NextResponse.json(
      { error: 'Failed to create maintenance schedule' },
      { status: 500 }
    );
  }
}

// PATCH /api/maintenance-schedules?id=<id> - Update a maintenance schedule
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
        { error: 'Schedule ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      property_id,
      date,
      type,
      vendor_id,
      vendor_name,
      status,
      requested_time,
      start_time,
      end_time,
      description,
      priority,
      acknowledgments
    } = body;

    // Auto-set start_time when status changes to 'ongoing'
    let finalStartTime = start_time;
    if (status === 'ongoing' && !start_time) {
      const current = await sql`SELECT start_time FROM maintenance_schedules WHERE id = ${id}`;
      if (current.length > 0 && !current[0].start_time) {
        const now = new Date();
        finalStartTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      }
    }

    // Auto-set end_time when status changes to 'completed'
    let finalEndTime = end_time;
    if (status === 'completed' && !end_time) {
      const current = await sql`SELECT end_time FROM maintenance_schedules WHERE id = ${id}`;
      if (current.length > 0 && !current[0].end_time) {
        const now = new Date();
        finalEndTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      }
    }

    const result = await sql`
      UPDATE maintenance_schedules
      SET 
        property_id = COALESCE(${property_id}, property_id),
        date = COALESCE(${date}, date),
        type = COALESCE(${type}, type),
        vendor_id = COALESCE(${vendor_id}, vendor_id),
        vendor_name = COALESCE(${vendor_name}, vendor_name),
        status = COALESCE(${status}, status),
        requested_time = COALESCE(${requested_time}, requested_time),
        start_time = COALESCE(${finalStartTime}, start_time),
        end_time = COALESCE(${finalEndTime}, end_time),
        description = COALESCE(${description}, description),
        priority = COALESCE(${priority}, priority),
        acknowledgments = COALESCE(${acknowledgments ? JSON.stringify(acknowledgments) : null}, acknowledgments),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating maintenance schedule:', error);
    return NextResponse.json(
      { error: 'Failed to update maintenance schedule' },
      { status: 500 }
    );
  }
}

// DELETE /api/maintenance-schedules?id=<id>&password=<password> - Delete a maintenance schedule
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
        { error: 'Schedule ID is required' },
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
      DELETE FROM maintenance_schedules
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Maintenance schedule deleted successfully',
      schedule: result[0]
    });
  } catch (error) {
    console.error('Error deleting maintenance schedule:', error);
    return NextResponse.json(
      { error: 'Failed to delete maintenance schedule' },
      { status: 500 }
    );
  }
}
