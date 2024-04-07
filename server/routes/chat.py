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

    # chat_completion = client.chat.completions.create(
    #     model="accounts/fireworks/models/llama-v2-13b-chat",
    #     temperature=0.25,
    #     # model='accounts/fireworks/models/yi-34b-chat',
    #     response_format={"type": "json_object", "schema": ChatOutputSchema.schema_json()},
    #     messages=messages,
    # )
    # chat_completion.choices[0].message.content = chat_completion.choices[0].message.content.strip()
    # if chat_completion.choices[0].message.content[-1] != '}':
    #     chat_completion.choices[0].message.content += '}'
    # response = json.loads(chat_completion.choices[0].message.model_dump_json())['content']
    # response = json.loads(response.strip())
    # print(response)
    # if response['response'] == 'clarify':
    #     return response
    # else:
    #     parking_day = response['day']
    #     start_time = response['start']
    #     end_time = response['end']
    #     res = await get_streets(parking_day, start_time, end_time, longitude, latitude, radius)
    #     return {
    #         "response": "done",
    #         "message": "Here is a parking that may work for you!",
    #         "parking": res
    #     }    
    import requests
    import json

    url = "https://api.fireworks.ai/inference/v1/chat/completions"
    payload = {
        "model": "accounts/fireworks/models/firefunction-v1",
        "max_tokens": 4096,
        "top_p": 1,
        "top_k": 40,
        "presence_penalty": 0,
        "frequency_penalty": 0,
        "temperature": 0.2,
        "messages": messages,
        "tools": [
            {
                "type": "function",
                "function": {
                    "name": "ask_clarifying_parking_question",
                    "description": "If the user is asking about parking, asks a clarifying question to gather 3 data points: The day of the week, the start hour, and the end hour of the user's desired parking time.",
                    "parameters": {
                    "type": "object",
                    "properties": {
                        "day_of_the_week": {
                        "type": "string",
                        "enum": [
                            "M",
                            "Tu",
                            "W",
                            "Th",
                            "F",
                            "Sa",
                            "Su"
                        ],
                        "description": "The day of the week"
                        },
                        "start_hour": {
                        "type": "number",
                        "description": "The start time of parking from 0000-2399"
                        },
                        "end_hour": {
                        "type": "number",
                        "description": "The end time of parking from 0000-2399"
                        }
                    },
                    "required": [
                        "day_of_the_week",
                        "start_hour",
                        "end_hour"
                    ]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "list_parking_time_as_json",
                    "description": "If the user is asking about parking and has provided the day of the week, start hour, and end hour, simply respond with the 3 metrics in JSON format.",
                    "parameters": {
                    "type": "object",
                    "properties": {
                        "day_of_the_week": {
                        "type": "string",
                        "enum": [
                            "M",
                            "Tu",
                            "W",
                            "Th",
                            "F",
                            "Sa",
                            "Su"
                        ],
                        "description": "The day of the week"
                        },
                        "start_hour": {
                        "type": "number",
                        "description": "The start time of parking from 0000-2399"
                        },
                        "end_hour": {
                        "type": "number",
                        "description": "The end time of parking from 0000-2399"
                        }
                    },
                    "required": [
                        "day_of_the_week",
                        "start_hour",
                        "end_hour"
                    ]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "analyze_message_and_determine_services",
                    "description": "If the user does not specify what service they want, analyze the user's message and try to determine what service they could find useful. Ask clarifying questions. Do NOT inquiry about the location or anything specific. Simply just figure out what the service is.",
                    "parameters": {
                    "type": "object",
                    "properties": {
                        "message": {
                            "type": "string",
                        },
                        "service": {
                            "type": "string",
                            "enum": ["bathrooms", "water", "laundry", "internet", "narcan"]
                        }
                    },
                    "required": [
                        "message"
                    ]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "return_required_service",
                    "description": "If the user is requesting a particular service, respond with a single word string of the service.",
                    "parameters": {
                    "type": "object",
                    "properties": {
                        "service": {
                            "type": "string",
                            "enum": ["bathrooms", "water", "laundry", "internet", "narcan"]
                        }
                    },
                    "required": [
                        "service"
                    ]
                    }
                }
            }
        ]
    }
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + FIREWORKS_KEY
    }
    response = requests.request("POST", url, headers=headers, data=json.dumps(payload))
    print(response.text)
    response = response.json()['choices'][0]['message']['content']
    if '{' in response and '}' in response:
        response = response[response.index('{'):response.index('}')+1]
        parking_day = json.loads(response)['day_of_the_week']
        start_time = json.loads(response)['start_hour']
        end_time = json.loads(response)['end_hour']
        res = await get_streets(parking_day, start_time, end_time, longitude, latitude, radius)
        return {
            "message": "Here is a parking that may work for you!",
            "parking": res
        }
    else:
        return { "message": response }

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
    # print(request.messages)
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
