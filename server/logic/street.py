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

async def get_streets(date_time: tuple[datetime.time], location: tuple, radius:int):
    streets = db.get_streets(location, radius)
    return streets
    