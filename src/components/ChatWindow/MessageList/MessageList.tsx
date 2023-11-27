import React, { useEffect, useRef } from 'react';

import ChatDetails from '../ChatDetails/ChatDetails';
import Avatar from 'components/Avatar/Avatar';
import Chat, { ChatType } from 'types/Chat';
import User from 'types/User';
import { ChannelChat } from 'types/Channel';
import { CONVERSATION_TYPE } from 'types';

interface Props {
	chatTitle: string,
	conversations: Chat[] | ChannelChat[]
	authUser: User,
	chatType: CONVERSATION_TYPE,
	deleteMessageFunc: (conversation: Chat | ChannelChat) => Promise<void>
}

/**
 * checks if a single user has sent consecutive messages without another
 * person sending a message
 * @param Message message object
 * @returns boolean
 */
const isMessageInAStreak = (messageIndex: number, messages: Chat[] | ChannelChat[], type: CONVERSATION_TYPE) => {
	if (messages.length === 0 || messageIndex === 0) return false;

	const presentChat = messages[messageIndex];
	const prevChat  = messages[messageIndex - 1];

	return type === CONVERSATION_TYPE.CHAT
		? (presentChat as Chat).from === (prevChat as Chat).from
		: (presentChat as ChannelChat).sender_id === (prevChat as ChannelChat).sender_id;
}

const MessageList = (props: Props): JSX.Element => {
	const isSignedInUserSender = (conversation: Chat | ChannelChat) => {
		// if from is in the object then it's a one to one chat
		if (conversation.hasOwnProperty('from')) {
			return (conversation as Chat).from === props.authUser.id;
		}
		return (conversation as ChannelChat).sender_id === props.authUser.id;
	}

	const chatDetailsEl = useRef<HTMLDivElement>(null);
	const chatBoxEl = useRef<HTMLDivElement>(null);

	const toggleChatDetails = (state: boolean): void => {
		if (state) {
			chatDetailsEl.current?.classList.remove('hide');
		} else {
			chatDetailsEl.current?.classList.add('hide');
		}
	}

	useEffect(() => {
		if (!chatBoxEl.current) return;
	
		const height = chatBoxEl.current.scrollHeight;
		chatBoxEl.current.scrollTo({ top: height, behavior: 'smooth' });
	}, []);

	const displayMessage = (conversation: ChannelChat | Chat): JSX.Element => {
		switch (conversation.message.type) {
			case ChatType.FILE:
				return <div className="text-bubble flex content-center cursor-pointer">
					<span className="mr-auto">{ conversation.message.value }</span>
					<i className="ri-download-line mr-3"></i>
					{
						isSignedInUserSender(conversation) &&
						<i className="ri-close-line" onClick={ () => props.deleteMessageFunc(conversation) }></i>
					}
				</div>
			default:
				// assume text as the default
				return <p className="text-bubble">{ conversation.message.value }</p>
		}
	}

	return (
		<>
			<div className="chat-details hide" ref={ chatDetailsEl }>
				<ChatDetails onCloseClick={ () => toggleChatDetails(false) }/>
			</div>
			<div className="chat-banner">
				<span>
					{ props.chatTitle }
				</span>
				<i className="ri-more-fill" onClick={ () => toggleChatDetails(true) }></i>
			</div>

			<div className="chat-box" ref={ chatBoxEl }>
				{
					props.conversations.map((conversation, index) => (
						<div 
							className={ `chat ${isSignedInUserSender(conversation) ? 'sending' : 'receiving'}` } 
							key={ index }
						>
							<div className="w-1/12">
								{ isMessageInAStreak(index, props.conversations, props.chatType) === false 
									?  <Avatar dimension={ 30 }/>
									: <span></span> 
								}
							</div>
							<div className="w-11/12 mx-3">
								{ displayMessage(conversation) }
							</div>
						</div>
					))	
				}
			</div>
		</> 
	)
}

export default MessageList;