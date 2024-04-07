import aiohttp
from env import NEURELO_KEY

db_url = 'https://us-west-2.aws.neurelo.com'

async def get_closest_streets(parking_day: str, start_time: int, end_time: int, x_coord: float, y_coord: float, radius: float) -> list[str]:
    async with aiohttp.ClientSession() as session:
        res = await session.get(
            # TODO: add correct query params once db is ready
            f'{db_url}/custom/find-time-location?start_time={start_time}&end_time={end_time}&parking_day={parking_day}&x_coord={x_coord}&y_coord={y_coord}&radius={radius}',
            headers = {'X-API-KEY': NEURELO_KEY}
        )
        res = await res.json()
        return res['data']
    
async def get_closest_restrooms(x_coord: float, y_coord: float):
    async with aiohttp.ClientSession() as session:
        res = await session.get(
            f'{db_url}/custom/find-closest-restrooms?x_coord={x_coord}&y_coord={y_coord}',
            headers = {'X-API-KEY': NEURELO_KEY}
        )
        res = await res.json()
        return res['data']

async def get_closest_water(x_coord: float, y_coord: float):
    async with aiohttp.ClientSession() as session:
        res = await session.get(
            f'{db_url}/custom/find-closest-water?x_coord={x_coord}&y_coord={y_coord}',
            headers = {'X-API-KEY': NEURELO_KEY}
        )
        res = await res.json()
        return res['data']

async def get_closest_narcan(x_coord: float, y_coord: float):
    async with aiohttp.ClientSession() as session:
        res = await session.get(
            f'{db_url}/custom/find-closest-narcan?x_coord={x_coord}&y_coord={y_coord}',
            headers = {'X-API-KEY': NEURELO_KEY}
        )
        res = await res.json()
        return res['data']

async def get_closest_library(x_coord: float, y_coord: float):
    async with aiohttp.ClientSession() as session:
        res = await session.get(
            f'{db_url}/custom/find-closest-libraries?x_coord={x_coord}&y_coord={y_coord}',
            headers = {'X-API-KEY': NEURELO_KEY}
        )
        res = await res.json()
        return res['data']