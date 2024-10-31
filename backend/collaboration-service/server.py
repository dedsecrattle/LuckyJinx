import socketio
import logging
import os
import dotenv

dotenv.load_dotenv()

from events import Events
from models import Room, User

logging.basicConfig(level=int(os.environ.get('LOG_LEVEL', logging.INFO)))

sio = socketio.AsyncServer(cors_allowed_origins='*', async_mode='asgi')
app = socketio.ASGIApp(sio)


@sio.event
async def connect(sid, environ):
    logging.info(f'connect {sid=}')


@sio.on(Events.JOIN_REQUEST)
async def join_request(sid, data):
    logging.debug(f'join_request {sid=} {data=}')
    room_id = data['room_id']
    username = data['username']
    await sio.enter_room(sid, room_id)
    room: Room = Room.get_or_create(room_id, User(username, sid))
    await sio.emit(Events.JOIN_REQUEST, room.details(), room=room_id, skip_sid=sid)


@sio.on(Events.CODE_UPDATED)
async def code_updated(sid, data):
    logging.debug(f'code_updated {sid=} {data=}')
    code = data['code']
    user: User = User.users[sid]
    user.room.update_code(code)
    await sio.emit(Events.CODE_UPDATED, code, room=user.room.id, skip_sid=sid)


@sio.on(Events.CURSOR_UPDATED)
async def cursor_updated(sid, data):
    logging.debug(f'cursor_updated {sid=} {data=}')
    cursor_position = data['cursor_position']
    user: User = User.users[sid]
    user.update_cursor_position(cursor_position)
    await sio.emit(Events.CURSOR_UPDATED, user.details(), room=user.room.id, skip_sid=sid)


@sio.event
async def disconnect(sid):
    logging.info(f'disconnect {sid=}')
    user: User = User.users[sid]
    room: Room = user.room
    room_still_exists = room.remove_user(user)
    if room_still_exists:
        await sio.emit(Events.USER_LEFT, user.details(), room=room.id)
