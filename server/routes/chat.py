import json
import requests

from fastapi import APIRouter, HTTPException
from env import FIREWORKS_KEY
from pydantic import BaseModel
from openai import OpenAI

from logic.street import get_streets
from logic.services import get_restrooms, get_water, get_narcan, get_libraries

class RequestBody(BaseModel):
    messages: list[dict[str, str]]
    longitude: float
    latitude: float
    radius: float = 0.1

class ServiceSchema(BaseModel):
    service: str

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
        model="accounts/fireworks/models/mixtral-8x7b-instruct",
        response_format={"type": "json_object", "schema": ServiceSchema.schema_json()},
        messages=[messages[-1]] + [{
            "role": "user",
            "content": "Which of the following services do you think I need: bathroom, water, library, narcan, parking, or none? Respond in JSON format."
        }],
    )

    requested_service = json.loads(chat_completion.choices[0].message.content)["service"]

    if requested_service == "parking":
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
                        "description": "If the user is asking about parking and you must ask a clarifying question to gather 3 data points: The day of the week, the start hour, and the end hour of the user's desired parking time.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "message": {
                                    "type": "string",
                                    "description": "The user's message."
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
                        "name": "list_parking_time_as_json",
                        "description": "If the user is asking about parking and has provided the day of the week, start hour, and end hour. Respond with the 3 metrics in JSON format.",
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
                            "description": "The start time of parking in 4 digit 24 hour time (0-2399)"
                            },
                            "end_hour": {
                            "type": "number",
                            "description": "The end time of parking in 4 digit 24 hour time (0-2399)"
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
            ]
        }
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + FIREWORKS_KEY
        }
        response = requests.request("POST", url, headers=headers, data=json.dumps(payload))
        print(response.text)

        # This thing is dumb and might switch the response format sometimes
        try:
            response = response.json()['choices'][0]['message']['content']
        except:
            response = response.json()['choices'][0]['message']['tool_calls'][0]['function']['arguments']
        
        print(response)
        # get parking
        if '{' in response and '}' in response and 'day_of_the_week' in response:
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
    elif requested_service == "bathroom":
        res = await get_restrooms(longitude, latitude)
        print('Finding bathrooms')
        return { 
            "message": "Now finding the nearest bathrooms.",
            "bathrooms": res
        }
    elif requested_service == "water":
        res = await get_water(longitude, latitude)
        print('Finding drinking fountains')
        return { 
            "message": "Now finding the nearest drinking fountains.",
            "fountains": res
        }
    elif requested_service == "library":
        res = await get_libraries(longitude, latitude)
        return { 
            "message": "Now finding the nearest libraries.",
            "libraries": res
        }
    elif requested_service == "narcan":
        res = await get_narcan(longitude, latitude)
        print('Finding narcan')
        return { 
            "message": "Now finding the nearest narcan stations.",
            "narcan": res
        }
    else:
        chat_completion = client.chat.completions.create(
            model="accounts/fireworks/models/mixtral-8x7b-instruct",
            messages=messages,
        )
        response = chat_completion.choices[0].message.content
        return { "message": response }

    # elif "Now finding" in response:
    #     if "bathroom" in response:
    #         res = await get_restrooms(longitude, latitude)
    #         print('Finding bathrooms')
    #         return { 
    #             "message": "Now finding the nearest bathrooms.",
    #             "bathrooms": res
    #         }
    #     elif "drinking fountain" in response:
    #         res = await get_water(longitude, latitude)
    #         print('Finding drinking fountains')
    #         return { 
    #             "message": "Now finding the nearest drinking fountains.",
    #             "fountains": res
    #         }
    #     # elif "laundromat" in response or "laundry" in response:
    #     #     res = await get_restrooms(longitude, latitude)
    #     #     return { 
    #     #         "message": "Now finding the nearest bathroom.",
    #     #         "bathrooms": res
    #     #     }
    #     elif "librar" in response:
    #         res = await get_libraries(longitude, latitude)
    #         return { 
    #             "message": "Now finding the nearest libraries.",
    #             "libraries": res
    #         }
    #     elif "narcan" in response:
    #         res = await get_narcan(longitude, latitude)
    #         print('Finding narcan')
    #         return { 
    #             "message": "Now finding the nearest narcan stations.",
    #             "narcan": res
    #         }
    # else:
    #     return { "message": response }

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