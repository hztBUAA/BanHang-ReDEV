from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from orm.database import get_db
import orm.schemas as schemas
import orm.crud as crud
from pydantic import BaseModel
from tools.check_user import check_user
from typing import List

router = APIRouter()

class ConversationShow(BaseModel):
	userAvatarUrl: str
	userName: str
	userId: int
	hasUnreadMessage: bool
	unreadMessageNum: int
	lastMessage: str

@router.post("/getReletedUser", tags=["Message"], response_model=List[ConversationShow])
@check_user
def get_recent_message_conversation(uid: int, db: Session = Depends(get_db)):
	db_conversations = crud.get_recent_conversation(db, uid)
	conversations = []
	for db_conversation in db_conversations:
		conversation = {}
		avatar = db_conversation.guest_user.userAvatarURL
		conversation['userAvatarUrl'] = avatar if avatar is not None else ""
		conversation['userName'] = db_conversation.guest_user.username
		conversation['userId'] = db_conversation.guest_user.id
		conversation['hasUnreadMessage'] = db_conversation.is_read
		conversation['unreadMessageNum'] = db_conversation.unread_message_num
		conversation['lastMessage'] = db_conversation.messages[-1].message.content if len(db_conversation.messages) > 0 else ""
		conversations.append(ConversationShow(**conversation))
	return conversations

class MessageGet(BaseModel):
	targetUserId: int

@router.post("/getHistoryMessage", tags=["Message"], response_model=List[schemas.MessageShow])
@check_user
def get_history_message(uid: int, message_get: MessageGet, db: Session = Depends(get_db)):
	db_conversation = crud.get_conversation(db, uid, message_get.targetUserId)
	db_conversation.unread_message_num = 0
	db.add(db_conversation)
	db.commit()
	messages = []
	for db_message_assoc in db_conversation.messages:
		db_message = db_message_assoc.message
		db_message_assoc.is_read = True
		message = {}
		message['senderName'] = db_message.sender.username
		message['senderId'] = db_message.sender_id
		message['receiverName'] = db_message.receiver.username
		message['receiverId'] = db_message.receiver_id
		message['content'] = db_message.content
		message['time'] = db_message.create_at
		message['read'] = db_message_assoc.is_read
		messages.append(schemas.MessageShow(**message))
	return messages

class MessageCreate(BaseModel):
	targetUserId: int
	content: str

@router.post("/sendMessage", tags=["Message"])
@check_user
def send_message(uid: int, message_create: MessageCreate, db: Session = Depends(get_db)):
	if len(message_create.content) == 0:
		return {"status": "error", "description": "Empty message"}
	res = crud.send_message(db, uid, message_create.targetUserId, message_create.content)
	if res:
		return {"status": "success"}
	else:
		return {"status": "error"}

@router.post("/getUnreadMessageNum", tags=["Message"])
@check_user
def get_unread_message_num(uid: int, db: Session = Depends(get_db)):
	num = crud.get_unread_message_num(db, uid)
	return {"status": "success", "num": num}