import { NextResponse } from 'next/server'
import { collectAndStoreMetrics } from '@/lib/metricCollector'

export async function GET() {
  try {
    await collectAndStoreMetrics()
    return NextResponse.json({ success: true })
  } catch{
    return NextResponse.json({ error: 'Failed to collect metrics' }, { status: 500 })
  }
}