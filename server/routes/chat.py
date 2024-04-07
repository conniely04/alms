import json

from fastapi import APIRouter, HTTPException
from env import FIREWORKS_KEY
from pydantic import BaseModel
from openai import OpenAI

from logic.street import get_streets

class RequestBody(BaseModel):
    messages: list[dict[str, str]]
    longitude: float
    latitude: float
    radius: float = 0.1

class TrueFalseSchema(BaseModel):
    boolean: bool

class ChatOutputSchema(BaseModel):
    message: str
    response: str
    start: int
    end: int
    day: str


client = OpenAI(
    base_url="https://api.fireworks.ai/inference/v1",
    api_key = FIREWORKS_KEY,
)

async def get_model_response(messages: list[dict[str, str]], longitude:float, latitude:float, radius:float):

    chat_completion = client.chat.completions.create(
        model="accounts/fireworks/models/llama-v2-13b-chat",
        temperature=0.25,
        # model='accounts/fireworks/models/yi-34b-chat',
        response_format={"type": "json_object", "schema": ChatOutputSchema.schema_json()},
        messages=messages,
    )
    chat_completion.choices[0].message.content = chat_completion.choices[0].message.content.strip()
    if chat_completion.choices[0].message.content[-1] != '}':
        chat_completion.choices[0].message.content += '}'
    response = json.loads(chat_completion.choices[0].message.model_dump_json())['content']
    response = json.loads(response.strip())
    print(response)
    if response['response'] == 'clarify':
        return response
    else:
        parking_day = response['day']
        start_time = response['start']
        end_time = response['end']
        res = await get_streets(parking_day, start_time, end_time, longitude, latitude, radius)
        return {
            "response": "done",
            "message": "Here is a parking that may work for you!",
            "parking": res
        }    

def is_message_looking_for_parking(message: str) -> bool:
    chat_completion = client.chat.completions.create(
        model="accounts/fireworks/models/mixtral-8x7b-instruct",
        response_format={"type": "json_object", "schema": TrueFalseSchema.model_json_schema()},
        messages=[
            {
                "role": "user",
                "content": "In JSON, taken this message and determine whether the user is looking for parking: " + message,
            },
        ],
    )
    return 'true' in chat_completion.choices[0].message.content


router = APIRouter(
    prefix='/chat'
)

@router.post('/')
async def chat(request: RequestBody):
    print(request.messages)
    return await get_model_response(request.messages, request.longitude, request.latitude, request.radius)

# STARTING REQUEST BODY. AS YOU MESSAGE, APPEND TO MESSAGES LIST.
# {
#     "messages":[
#             {
#                 "role": "system",
#                 "content": "You are a smart parking assistant AI. Your task is to take user input and determine when they are look for parking. You must determine the day of the week, the start hour (in 4 digit 24 hour time), and the end hour (in 4 digit 24 hour time) of their parking. If you are unsure, make sure to ask clarifying questions. You are NOT to determine any information about the parking itself. You are not done until you know all of the following: Day of the week, start hour (in 4 digit 24 hour time), end hour (in 4 digit 24 hour time). DO NOT SET YOUR RESPONSE TO DONE UNTIL YOU ARE SURE YOU HAVE ALL INFORMATION REQUIRED. If you are clarifying, set your response property to clarify. If you are done, set your response property to done. Respond in JSON."
#             },
#             {
#                 "role": "user",
#                 "content": ""
#             }
#     ],
#     "longitude": -122.4,
#     "latitude": 37.7,
#     "radius": 1.0
# }
