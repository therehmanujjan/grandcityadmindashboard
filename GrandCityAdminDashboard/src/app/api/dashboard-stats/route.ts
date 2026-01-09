import { NextResponse } from 'next/server';
import { sql } from '@/utils/neonClient';

// GET /api/dashboard-stats - Fetch latest dashboard stats
export async function GET() {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const stats = await sql`
      SELECT * FROM dashboard_stats 
      ORDER BY stats_date DESC, created_at DESC 
      LIMIT 1
    `;
    
    if (stats.length === 0) {
      // Return default stats if none exist
      return NextResponse.json({
        pending_tasks: 0,
        today_meetings: 0,
        pending_payments: 0,
        active_vendors: 0,
        monthly_budget: 0,
        budget_used: 0,
        staff_present: 0,
        total_staff: 0,
        active_projects: 0,
        client_satisfaction: 0,
        daily_photo_uploads: 0,
        shifts_today: 0
      });
    }

    return NextResponse.json(stats[0]);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}

// POST /api/dashboard-stats - Update/refresh dashboard stats
export async function POST() {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Call the stored procedure to update stats
    await sql`SELECT update_dashboard_stats()`;
    
    // Fetch and return the updated stats
    const stats = await sql`
      SELECT * FROM dashboard_stats 
      ORDER BY stats_date DESC, created_at DESC 
      LIMIT 1
    `;

    return NextResponse.json(stats[0]);
  } catch (error) {
    console.error('Error updating dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to update dashboard stats' },
      { status: 500 }
    );
  }
}
