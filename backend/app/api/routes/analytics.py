from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from app.schemas.analytics import (
    SummaryResponse, RevenueTrendPoint, OutletPerformance,
    GroupPerformance, OrderTypeDistribution, TopProduct,
    SettlementDistribution, PaginatedOrdersResponse, FilterOptionsResponse
)
from app.services.analytics_service import AnalyticsService

router = APIRouter()

def parse_filter_params(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    outlet: Optional[str] = None,
    brand: Optional[str] = None,
    group: Optional[str] = None,
    order_type: Optional[str] = None,
    settlement: Optional[str] = None
) -> dict:
    return {
        "start_date": start_date,
        "end_date": end_date,
        "outlet": outlet,
        "brand": brand,
        "group": group,
        "order_type": order_type,
        "settlement": settlement
    }

@router.get("/summary", response_model=SummaryResponse)
def get_summary(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    outlet: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    group: Optional[str] = Query(None),
    order_type: Optional[str] = Query(None),
    settlement: Optional[str] = Query(None)
):
    filters = parse_filter_params(start_date, end_date, outlet, brand, group, order_type, settlement)
    return AnalyticsService.get_summary(filters)

@router.get("/revenue-trend", response_model=List[RevenueTrendPoint])
def get_revenue_trend(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    outlet: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    group: Optional[str] = Query(None),
    order_type: Optional[str] = Query(None),
    settlement: Optional[str] = Query(None)
):
    filters = parse_filter_params(start_date, end_date, outlet, brand, group, order_type, settlement)
    return AnalyticsService.get_revenue_trend(filters)

@router.get("/outlet-performance", response_model=List[OutletPerformance])
def get_outlet_performance(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    outlet: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    group: Optional[str] = Query(None),
    order_type: Optional[str] = Query(None),
    settlement: Optional[str] = Query(None)
):
    filters = parse_filter_params(start_date, end_date, outlet, brand, group, order_type, settlement)
    return AnalyticsService.get_outlet_performance(filters)

@router.get("/group-performance", response_model=List[GroupPerformance])
def get_group_performance(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    outlet: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    group: Optional[str] = Query(None),
    order_type: Optional[str] = Query(None),
    settlement: Optional[str] = Query(None)
):
    filters = parse_filter_params(start_date, end_date, outlet, brand, group, order_type, settlement)
    return AnalyticsService.get_group_performance(filters)

@router.get("/order-type", response_model=List[OrderTypeDistribution])
def get_order_type_distribution(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    outlet: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    group: Optional[str] = Query(None),
    order_type: Optional[str] = Query(None),
    settlement: Optional[str] = Query(None)
):
    filters = parse_filter_params(start_date, end_date, outlet, brand, group, order_type, settlement)
    return AnalyticsService.get_order_type_distribution(filters)

@router.get("/top-products", response_model=List[TopProduct])
def get_top_products(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    outlet: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    group: Optional[str] = Query(None),
    order_type: Optional[str] = Query(None),
    settlement: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=50)
):
    filters = parse_filter_params(start_date, end_date, outlet, brand, group, order_type, settlement)
    return AnalyticsService.get_top_products(filters, limit=limit)

@router.get("/settlement", response_model=List[SettlementDistribution])
def get_settlement_distribution(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    outlet: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    group: Optional[str] = Query(None),
    order_type: Optional[str] = Query(None),
    settlement: Optional[str] = Query(None)
):
    filters = parse_filter_params(start_date, end_date, outlet, brand, group, order_type, settlement)
    return AnalyticsService.get_settlement_distribution(filters)

@router.get("/orders", response_model=PaginatedOrdersResponse)
def get_orders(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    outlet: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    group: Optional[str] = Query(None),
    order_type: Optional[str] = Query(None),
    settlement: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    search: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("Order_Datetime"),
    sort_order: Optional[str] = Query("DESC")
):
    filters = parse_filter_params(start_date, end_date, outlet, brand, group, order_type, settlement)
    return AnalyticsService.get_orders_paginated(
        filters=filters,
        page=page,
        page_size=page_size,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order
    )

@router.get("/filters", response_model=FilterOptionsResponse)
def get_filters():
    return AnalyticsService.get_filter_options()
