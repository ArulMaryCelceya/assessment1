from fastapi import APIRouter
from app.database.database import get_db

router = APIRouter()

@router.get("/health")
def health_check():
    db_status = "connected"
    total_records = 0
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM sales")
            total_records = cursor.fetchone()[0]
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy",
        "database": db_status,
        "total_records": total_records
    }
