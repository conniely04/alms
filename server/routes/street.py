from fastapi import APIRouter, HTTPException
from logic import street

router = APIRouter(
    prefix='/parking'
)

@router.get('/')
async def find_parking(parking_day: str, start_time: int, end_time: int, x_coord: float, y_coord: float, radius: float):
    res = await street.get_streets(parking_day, start_time, end_time, x_coord, y_coord, radius)
    if not res:
        return HTTPException(status_code=400, detail='No parking found')
    return res