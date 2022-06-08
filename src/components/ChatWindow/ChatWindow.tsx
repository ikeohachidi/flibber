import { useEffect, useRef } from 'react';
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

type ParticipantKind = 'none' | 'user' | 'channel'

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

const ChatName = (kind: ParticipantKind, channel: Channel, user: User): JSX.Element => {
	switch (kind) {
		case 'user':
			return <span>{ user.name }</span> 
			break; 
		case 'channel':
			return <span>{ channel.name }</span>
		default:
			return <span>No active chat participant</span>;
	}
} 

const ChatWindow = (): JSX.Element => {
	const dispatch = useDispatch();

	const chatDetailsEl = useRef<HTMLDivElement>(null);
	const participantKind = (): 'user' | 'channel' | 'none' => {
		if (activeChatUser.id > 0) return 'user';
		if (activeChannel.id > 0) return 'channel';

		return 'none';
	}

	const activeChatUser = useSelector<AppState, User>(state => state.chat.activeUserChat);
	const activeChannel = useSelector<AppState, Channel>(state => state.channel.activeChannel);
	const authUser = useSelector<AppState, User>(state => state.user.user!);
	const conversations = useSelector<AppState, Chat[]>(state => {
		let participantId = activeChatUser.id;
		if (participantKind() === 'channel') participantId = activeChannel.id;

		return state.chat.conversation[participantId] || []
	});
	const isFetchingConversation = useSelector<AppState, boolean>(state => state.chat.isFetchingConversation);
	const loadedConversations = useSelector<AppState, number[]>(state => state.chat.loadedConversations);

	const isSignedInUserSender = (senderId: number) => senderId === authUser.id;

	const onCloseClick = () => {
		chatDetailsEl.current?.classList.toggle('hide');
	}

	useEffect(() => {
		switch (participantKind()) {
			case 'user':
				if (!loadedConversations.includes(activeChatUser.id)) {
					dispatch(getConversationService({
						chatId: chatId(authUser.id, activeChatUser.id),
						authUser: authUser.id
					}))
				}
				break;	
			case 'channel':
				if (!loadedConversations.includes(activeChannel.id)) {
					dispatch(getConversationService({
						chatId: activeChannel.id,
						authUser: authUser.id
					}))
				}
				break;
			case 'none':
			default:
				return;
		}

	}, [ activeChatUser.id, activeChannel.id ])

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
					{ ChatName(participantKind(), activeChannel, activeChatUser)}
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
					participant={ 
						participantKind() === 'user'
						? activeChatUser
						: activeChannel
					}
					authUser={ authUser }
					
				/>
			</div>
		</section>
	)
}

export default ChatWindow;