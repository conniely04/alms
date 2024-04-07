from data import db

async def get_restrooms(x_coord: float, y_coord: float):
    return await db.get_closest_restrooms(x_coord, y_coord)

async def get_water(x_coord: float, y_coord: float):
    return await db.get_closest_water(x_coord, y_coord)

async def get_narcan(x_coord: float, y_coord: float):
    return await db.get_closest_narcan(x_coord, y_coord)