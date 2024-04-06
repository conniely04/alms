from fastapi import APIRouter

router = APIRouter(
    prefix='/services'
)

@router.get('/')
def find_services(query: str, location: str):
    return {'query': query, 'location': location}