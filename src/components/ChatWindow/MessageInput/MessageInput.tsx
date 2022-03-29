import React, { KeyboardEvent, useRef } from 'react';
import './MessageInput.css';
import User from 'types/User';
import Chat, { ChatType } from 'types/Chat';
import { useDispatch } from 'react-redux';
import { sendMessageService } from 'services/chat';

type Props = {
	activeChatUser: User | null;
	authUserId: number;
}

const MessageInput = ({ activeChatUser, authUserId }: Props): JSX.Element => {
	const dispatch = useDispatch();
	const messageInput = useRef<HTMLInputElement>(null);

	const sendMessage = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && activeChatUser) {
			const chat: Chat = {
				to: activeChatUser.id,
				from: authUserId,
				message: {
					type: ChatType.TEXT,
					value: messageInput.current!.value
				}
			}

			dispatch(sendMessageService(chat))	
			messageInput.current!.value = '';
		}
	}

	return (
		<div className="message-input-container">
			<i className="ri-mic-2-line"></i>
			<input 
				className="custom" 
				type="text" 
				placeholder={ activeChatUser ? `Message ${activeChatUser.name}` : 'Send Message' } 
				onKeyDown={ sendMessage }
				ref={ messageInput }
			/>
			<i className="ri-add-line mx-4"></i>
			<i className="ri-send-plane-line"></i>
		</div>
	)
}

export default MessageInput;