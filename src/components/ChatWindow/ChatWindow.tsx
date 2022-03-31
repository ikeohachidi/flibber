import { Dispatch, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SupabaseRealtimePayload } from '@supabase/supabase-js';

import MessageInput from './MessageInput/MessageInput';
import Avatar from 'components/Avatar/Avatar';
import ChatDetails from './ChatDetails/ChatDetails';

import './ChatWindow.css';

import { AppState } from 'store';
import { chatSubscribe } from 'supabase/chat';
import { getConversationService } from 'services/chat';

import Chat, { ChatType } from 'types/Chat'
import User from 'types/User';
import { addMessageToConversation } from 'store/chat';


/**
 * checks if a single user has sent consecutive messages without another
 * person sending a message
 * @param Message message object
 * @returns boolean
 */
const isMessageInAStreak = (messageIndex: number, messages: Chat[]) => {
	if (messages.length === 0 || messageIndex === 0) return false;

	const presentChat = messages[messageIndex];
	const prevChat  = messages[messageIndex - 1];

	return presentChat.from === prevChat.from;
}

const onMessageReceived = (dispatch: Dispatch<unknown>, authUserId: number) => {
	return (payload: SupabaseRealtimePayload<Chat>): void => {
		if (payload.eventType === 'INSERT' && payload.new.from !== authUserId) {
			dispatch(addMessageToConversation({
				authUserId,
				chat: payload.new
			}))
		}
	}
}

const ChatWindow = (): JSX.Element => {
	const activeChatUser = useSelector<AppState, User>(state => state.chat.activeUserChat);
	const authUserId = useSelector<AppState, number>(state => state.user.user?.id!);
	const dispatch = useDispatch();
	const conversations = useSelector<AppState, Chat[]>(state => state.chat.conversation[activeChatUser.id] || []);
	const isSignedInUserSender = (senderId: number) => senderId === authUserId;


	useEffect(() => {
		if (activeChatUser.id === 0) return;

		dispatch(getConversationService({
			user1: activeChatUser.id,
			user2: authUserId,
			authUser: authUserId
		}))

		const eventCallback = onMessageReceived(dispatch, authUserId);
		chatSubscribe(authUserId, activeChatUser.id, eventCallback);

	}, [ activeChatUser.id ])

	const chatDetailsEl = useRef<HTMLDivElement>(null);

	const onCloseClick = () => {
		chatDetailsEl.current?.classList.toggle('hide');
	}

	return (
		<section className="chat-container">
			<div className="chat-details hide" ref={ chatDetailsEl }>
				<ChatDetails onCloseClick={ onCloseClick }/>
			</div>
			<div className="chat-banner">
				<span>
					{
						activeChatUser
						? activeChatUser.name
						: 'No active chat participant' 
					}
				</span>
				<i className="ri-more-fill" onClick={ onCloseClick }></i>
			</div>
			<div className="chat-box">
				{
					conversations.map((conversation, index) => (
						<div 
							className={ `chat ${isSignedInUserSender(conversation.from) ? 'sending' : 'receiving'}` } 
							key={ index }
						>
							<div className="w-1/12">
								{ isMessageInAStreak(index, conversations) === false 
									?  <Avatar dimension={ 30 }/>
									: <span></span> 
								}
							</div>
							<div className="w-11/12 mx-3">
								{ conversation.message.type === ChatType.TEXT &&
									<p className="text-bubble">{ conversation.message.value }</p>
								}
							</div>
						</div>
					))	
				}
			</div>
			<div className="message-input">
				<MessageInput 
					activeChatUser={ activeChatUser }
					authUserId={ authUserId }
					
				/>
			</div>
		</section>
	)
}

export default ChatWindow;