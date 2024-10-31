class User:
    users: dict[str, "User"] = {}

    def __init__(self, username: str, sid: str):
        self.username = username
        self.cursor_position = 0
        self.sid = sid
        self.room: "Room" = None
        User.users[sid] = self
    
    def join_room(self, room: "Room") -> None:
        self.room = room
    
    def update_cursor_position(self, position: int) -> None:
        self.cursor_position = position
    
    def details(self) -> dict:
        return {
            'username': self.username,
            'cursor_position': self.cursor_position,
        }
    
    def __eq__(self, other) -> bool:
        if not isinstance(other, User):
            return False
        return self.username == other.username
    
    def __repr__(self) -> str:
        return f'User(username={self.username}, cursor_position={self.cursor_position})'
    
    def __str__(self) -> str:
        return self.__repr__()

    def remove_user(user: "User") -> None:
        del User.users[user.sid]


class Room:
    rooms: dict[str, "Room"] = {}

    def __init__(self, room_id: str, user: User):
        self.id = room_id
        self.users: list[User] = [user]
        self.code = ""
        Room.rooms[room_id] = self
        user.join_room(self)
    
    def add_user(self, user: User) -> None:
        self.users.append(user)
        user.join_room(self)

    def remove_user(self, user: User) -> bool:
        self.users.remove(user)
        User.remove_user(user)
        if len(self.users) == 0:
            del Room.rooms[self.id]
            return False
        else:
            return True
    
    def update_code(self, code: str) -> None:
        self.code = code
    
    def details(self) -> dict:
        return {
            'id': self.id,
            'users': [user.details() for user in self.users],
            'code': self.code,
        }
    
    def __eq__(self, other) -> bool:
        if not isinstance(other, Room):
            return False
        return self.id == other.id

    def __repr__(self) -> str:
        return f'Room(id={self.id}, users={self.users}, code={self.code})'

    def __str__(self) -> str:
        return self.__repr__()
    
    def get_or_create(room_id: str, user: User) -> "Room":
        if room_id in Room.rooms:
            room = Room.rooms[room_id]
            room.add_user(user)
            return room
        else:
            return Room(room_id, user)
