import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MessageInput from './MessageInput/MessageInput';
import Avatar from 'components/Avatar/Avatar';
import ChatDetails from './ChatDetails/ChatDetails';
import Spinner from 'components/Spinner/Spinner';

import './ChatWindow.css';

import { AppState } from 'store';
import { getConversationService } from 'services/chat';
import { chatId } from 'utils/chat';

import Chat, { ChatType } from 'types/Chat'
import User from 'types/User';
import { Channel } from 'types/Channel';
import { getChannelMessagesService } from 'services/channel';

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

const ChatWindow = (): JSX.Element => {
	const dispatch = useDispatch();
	const isSignedInUserSender = (senderId: number) => senderId === authUser.id;

	const activeChatUser = useSelector<AppState, User | null>(state => state.chat.activeUserChat);
	const activeChannel = useSelector<AppState, Channel | null>(state => state.channel.activeChannel);
	const authUser = useSelector<AppState, User>(state => state.user.user!);
	const conversations = useSelector<AppState, Chat[]>(state => {
		if (activeChatUser) return state.chat.conversation[activeChatUser.id];

		return [];
	});
	const isFetchingConversation = useSelector<AppState, boolean>(state => state.chat.isFetchingConversation);
	const loadedConversations = useSelector<AppState, number[]>(state => state.chat.loadedConversations);

	useEffect(() => {
		if (!activeChatUser || activeChatUser.id === 0) return;

		if (!loadedConversations.includes(activeChatUser.id)) {
			dispatch(getConversationService({
				chatId: chatId(authUser.id, activeChatUser.id),
				authUser: authUser.id
			}))
		}

	}, [ activeChatUser ])

	useEffect(() => {
		if (!activeChannel || activeChannel.id === 0) return;
		
		dispatch(getChannelMessagesService(activeChannel.id as number)) 
	}, [ activeChannel ])
	const chatDetailsEl = useRef<HTMLDivElement>(null);

	const onCloseClick = () => {
		chatDetailsEl.current?.classList.toggle('hide');
	}

	const title = () => {
		if (activeChatUser) return activeChatUser.name;
		
		if (activeChannel) return activeChannel.name;

		return 'No active chat participant'; }

	return (
		<section className="chat-container">
			{
				isFetchingConversation &&
				<Spinner 
					fullSize={ true }
				/>
			}

			<div className="chat-details hide" ref={ chatDetailsEl }>
				<ChatDetails onCloseClick={ onCloseClick }/>
			</div>
			<div className="chat-banner">
				<span>
					{ title() }
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
					activeChannel={ activeChannel }
					authUser={ authUser }
					
				/>
			</div>
		</section>
	)
}

export default ChatWindow;