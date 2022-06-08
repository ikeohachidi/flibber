import React, { KeyboardEvent } from 'react';
import { useDispatch } from 'react-redux';

import './MessageInput.css';

import { sendMessageService } from 'services/chat';

import User from 'types/User';
import { Channel } from 'types/Channel';
import { ChatType, ChatSource, RecentChat } from 'types/Chat';
import { timeNow } from 'utils/date';

type Props = {
	participant: ChatSource;
	authUser: User;
}

const MessageInput = ({ participant, authUser }: Props): JSX.Element => {
	const dispatch = useDispatch();

	const sendMessage = (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;

		if (target.value === '') return;

		if (e.key === 'Enter' && participant) {
			const chat: RecentChat = {
				to: participant,
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
		<div className={ `message-input-container ${ participant.id < 1 && 'disabled' }` }>
			<i className="ri-mic-2-line"></i>
			<input 
				disabled={ participant && (participant.id < 1) }
				className="custom" 
				type="text" 
				placeholder={ participant ? `Message ${participant.name}` : 'Send Message' } 
				onKeyDown={ sendMessage }
			/>
			<i className="ri-add-line mx-4"></i>
			<i className="ri-send-plane-line"></i>
		</div>
	)
}

export default MessageInput;