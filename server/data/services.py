import aiohttp
from env import OPENAPI_KEY

gpt_url = 'https://api.openai.com/v1/chat/completions'


def parse_query(query: str, long: float, lat: float):
    aiohttp.post(
        gpt_url,
        headers = {
            'Authorization': f'Bearer {OPENAPI_KEY}',
            'Content-Type': 'application/json'
        },
        json = {
            'model': 'gpt-3.5-turbo',  
            'message': ''
        }
    )
