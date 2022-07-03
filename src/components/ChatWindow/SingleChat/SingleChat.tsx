import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from 'components/Avatar/Avatar';
import ChatDetails from '../ChatDetails/ChatDetails';

import '../ChatWindow.css';

import { AppState } from 'store';
import { getConversationService } from 'services/chat';
import { chatId } from 'utils/chat';

import Chat, { ChatType } from 'types/Chat'
import User from 'types/User';


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


interface Props {
	authUser: User
}

const SingleChat = ({ authUser }: Props): JSX.Element => {
	const dispatch = useDispatch();

	const activeChatUser = useSelector<AppState, User>(state => state.chat.activeUserChat!);
	const loadedConversations = useSelector<AppState, {[userId: string]: true}>(state => state.chat.loadedConversations);
	const conversations = useSelector<AppState, Chat[]>(state => {
		if (activeChatUser.id in state.chat.conversation) {
			return state.chat.conversation[activeChatUser.id];
		}

		return [];
	});

	const isSignedInUserSender = (senderId: number) => senderId === authUser.id;

	const chatDetailsEl = useRef<HTMLDivElement>(null);
	const toggleChatDetails = (state: boolean): void => {
		if (state) {
			chatDetailsEl.current?.classList.remove('hide');
		} else {
			chatDetailsEl.current?.classList.add('hide');
		}
	}

	useEffect(() => {
		if (!(activeChatUser.id in loadedConversations)) {
			dispatch(getConversationService({
				chatId: chatId(authUser.id, activeChatUser.id),
				authUser: authUser.id
			}))
		}

	}, [ activeChatUser ])

	return (
		<>
			<div className="chat-details hide" ref={ chatDetailsEl }>
				<ChatDetails onCloseClick={ () => toggleChatDetails(false) }/>
			</div>
			<div className="chat-banner">
				<span>
					{ activeChatUser.name }
				</span>
				<i className="ri-more-fill" onClick={ () => toggleChatDetails(true) }></i>
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
		</> 
	)
}

export default SingleChat;