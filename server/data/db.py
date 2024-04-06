import aiohttp
import datetime
import enum
from env import NEURELO_KEY

db_url = 'https://us-west-2.aws.neurelo.com/rest/parking'

async def get_closest_streets(day: str, date_time: tuple[datetime.time], parking_time: datetime.time,  location: tuple, radius:int):
    async with aiohttp.ClientSession() as session:
        res = await session.get(
            # TODO: add correct query params once db is ready
            f'{db_url}/custom/find-time-location?',
            headers = {'X-API-KEY': NEURELO_KEY}
        )
        res = await res.json()
        return res