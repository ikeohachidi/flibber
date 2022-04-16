import React, { KeyboardEvent } from 'react';
import { useDispatch } from 'react-redux';

import './MessageInput.css';

import { sendMessageService } from 'services/chat';

import User from 'types/User';
import { ChatType, RecentChat } from 'types/Chat';
import { timeNow } from 'utils/date';

type Props = {
	activeChatUser: User | null;
	authUser: User;
}

const MessageInput = ({ activeChatUser, authUser }: Props): JSX.Element => {
	const dispatch = useDispatch();

	const sendMessage = (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;

		if (target.value === '') return;

		if (e.key === 'Enter' && activeChatUser) {
			const chat: RecentChat = {
				to: activeChatUser,
				from: authUser,
				created_at: timeNow(),
				message: {
					type: ChatType.TEXT,
					value: target.value 
				}
			}

			dispatch(sendMessageService(chat))
			target.value = '';
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
			/>
			<i className="ri-add-line mx-4"></i>
			<i className="ri-send-plane-line"></i>
		</div>
	)
}

export default MessageInput;