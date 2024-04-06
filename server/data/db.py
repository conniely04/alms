import aiohttp
import datetime
from env import NEURELO_KEY

db_url = ''

async def get_closest_streets(date_time: tuple[datetime.time], location: tuple, radius:int):
    async with aiohttp.ClientSession() as session:
        db_res = session.get(
            # TODO: add correct query after neurelo responds
            f'{db_url}/streets?',
            headers = {'X-API-KEY': NEURELO_KEY}
        ).json()
        return db_res