import { NextRequest, NextResponse } from 'next/server';
import {
  getInitialSummary,
  getInitialAnalytics,
  getInitialRecords,
  filterAnalytics,
  filterRecords,
} from '../../../lib/analytics/data-service';
import { FilterState } from '../../../types/analytics';

export const dynamic = 'force-dynamic';


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const outlets = searchParams.get('outlets') ? searchParams.get('outlets')!.split(',') : [];
    const brands = searchParams.get('brands') ? searchParams.get('brands')!.split(',') : [];
    const categories = searchParams.get('categories') ? searchParams.get('categories')!.split(',') : [];
    const orderTypes = searchParams.get('orderTypes') ? searchParams.get('orderTypes')!.split(',') : [];
    const settlements = searchParams.get('settlements') ? searchParams.get('settlements')!.split(',') : [];
    const searchTerm = searchParams.get('search') || '';

    const filters: FilterState = {
      startDate,
      endDate,
      outlets,
      brands,
      categories,
      orderTypes,
      settlements,
      searchTerm,
    };

    const hasFilters =
      startDate ||
      endDate ||
      outlets.length > 0 ||
      brands.length > 0 ||
      categories.length > 0 ||
      orderTypes.length > 0 ||
      settlements.length > 0 ||
      searchTerm;

    if (!hasFilters) {
      return NextResponse.json({
        summary: getInitialSummary(),
        analytics: getInitialAnalytics(),
        records: getInitialRecords(),
      });
    }

    const filteredResult = filterAnalytics(filters);
    const filteredRecordList = filterRecords(filters);

    return NextResponse.json({
      summary: filteredResult.summary,
      analytics: filteredResult.analytics,
      records: filteredRecordList,
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to process analytics request.' },
      { status: 500 }
    );
  }
}
