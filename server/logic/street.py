from data import db

'''
starting_time = a time
end_time = a time
segments = []
while end_time > starting_time:

    parking_time = end_time - starting_time
    segment = None

    while parking_time > 0 and !segment:
        parking_time -= 1
        find streets between starting_time and starting_time + parking_time

    if segment:
        add to segments
        starting_time = starting_time + parking_time
    else:
        return 'no parking found for this time'
'''

async def get_streets(parking_day: str, start_time: int, end_time: int, x_coord: float, y_coord: float, radius: float):
    segments = []

    while end_time > start_time:
        parking_time = end_time - start_time
        possible_segment_list = []

        while parking_time > 0 and not possible_segment_list:
            print(f'searching for street of {parking_time} hours')
            possible_segment_list = await db.get_closest_streets(parking_day, start_time, end_time, x_coord, y_coord, radius)
            parking_time -= 100

        if possible_segment_list:
            print(possible_segment_list)
            segments.append(possible_segment_list[0])
            start_time = start_time + parking_time + 100
        else:
            print('no parking found for this time')
            return []
        
    return segments