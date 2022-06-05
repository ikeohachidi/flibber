import React, { KeyboardEvent } from 'react';
import { useDispatch } from 'react-redux';
import './MessageInput.css';

import { sendMessageService } from 'services/chat';
import { sendChannelMessageService } from 'services/channel';
import { Channel, ChannelChat } from 'types/Channel';
import { ChatType, RecentChat } from 'types/Chat';
import User from 'types/User';
import { timeNow } from 'utils/date';

type Props = {
	activeChatUser: User | null;
	activeChannel: Channel | null;
	authUser: User;
}

const MessageInput = ({ activeChatUser, activeChannel, authUser }: Props): JSX.Element => {
	const dispatch = useDispatch();

	const activeChatType = () => {
		if (activeChatUser) return 'user'
		return 'channel'
	}

	const sendMessage = (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;

		if (target.value === '') return;

		if (e.key === 'Enter') {
			if (activeChatUser && activeChatType() === 'user') {
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
			
			if (activeChannel && activeChatType() === 'channel') {
				const chat: ChannelChat = {
					sender_id: authUser.id,
					channel_id: activeChannel.id!,
					created_at: timeNow(),
					message: {
						type: ChatType.TEXT,
						value: target.value 
					}
				}

				dispatch(sendChannelMessageService(chat))
				target.value = '';
			}
		}
	}

	const shouldDisableInput = (): boolean => {
		if (activeChatType() === 'user' && activeChatUser) return true;
		if (activeChatType() === 'channel' && activeChannel) return true;

		return false;
	}

	return (
		<div className={ `message-input-container ${ activeChatUser && activeChatUser.id < 1 && 'disabled' }` }>
			<i className="ri-mic-2-line"></i>
			<input 
				disabled={ !shouldDisableInput() }
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