from pydantic import BaseModel, Field
from typing import List, Optional

class AnalyticsFilters(BaseModel):
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    outlet: Optional[str] = None
    brand: Optional[str] = None
    group: Optional[str] = None
    order_type: Optional[str] = None
    settlement: Optional[str] = None

class SummaryResponse(BaseModel):
    total_revenue: float
    total_orders: int
    total_items_sold: float
    average_order_value: float
    total_outlets: int
    total_products: int

class RevenueTrendPoint(BaseModel):
    date: str
    revenue: float
    orders: int

class OutletPerformance(BaseModel):
    outlet_name: str
    revenue: float
    orders: int
    items_sold: float

class GroupPerformance(BaseModel):
    group: str
    revenue: float
    orders: int
    items_sold: float
    percentage: float

class OrderTypeDistribution(BaseModel):
    order_type: str
    revenue: float
    orders: int

class TopProduct(BaseModel):
    item: str
    group: str
    revenue: float
    quantity: float

class SettlementDistribution(BaseModel):
    settlement: str
    revenue: float
    orders: int

class OrderRecord(BaseModel):
    id: int
    BillNo: str
    Outlet_Name: str
    Brand: str
    Order_Datetime: str
    Group: str
    Item: str
    Price: float
    Quantity: float
    Revenue: float
    Order_Type: str
    Settlement: str

class PaginatedOrdersResponse(BaseModel):
    total_records: int
    page: int
    page_size: int
    total_pages: int
    orders: List[OrderRecord]

class FilterOptionsResponse(BaseModel):
    outlets: List[str]
    brands: List[str]
    groups: List[str]
    order_types: List[str]
    settlements: List[str]
    min_date: str
    max_date: str
