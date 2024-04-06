import aiohttp
import asyncio
# from env import NEURELO_KEY

NEURELO_KEY = 'neurelo_9wKFBp874Z5xFw6ZCfvhXd1NNE7zbVc2cHj2GQXvm3W/q3tD6DvIOfb3vTguy4PM/O+ZFPJ9kB6O8LTrKyvn5zdNlgkusZFhXG7DilVKp3lyVqn6fOZfU0Q6DIqTgrWu4+qYP5xMnEeeV7yNWekaxDoOkonnk4698r+RgPIZIT7sJ83TxmsAaRTNPukm7iIY_13UXZq7qLUOPVlO+/UkMnOWpvS/O8veTPh0gUG5ZenU='

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
    
# async def main():
#     res = await get_closest_streets('M', 900, 1800, -122.4, 37.7, 0.1)
#     print(res)

# asyncio.run(main())