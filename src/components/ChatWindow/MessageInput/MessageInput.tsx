import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './MessageInput.css';

import Spinner from 'components/Spinner/Spinner';

import { sendMessageService } from 'services/chat';
import { sendChannelMessageService } from 'services/channel';
import { Channel, ChannelChat } from 'types/Channel';
import { ChatType, RecentChat } from 'types/Chat';
import { CONVERSATION_TYPE } from 'types';
import User from 'types/User';
import { timeNow } from 'utils/date';
import { STORAGE_MAX_SIZE } from 'utils/envs';
import { AppState } from 'store';
import { uploadFile } from 'supabase/storage';
import { chatId } from 'utils/chat';

type Props = {
	activeChatUser: User | null;
	activeChannel: Channel | null;
	authUser: User;
}

const MessageInput = ({ activeChatUser, activeChannel, authUser }: Props): JSX.Element => {
	const dispatch = useDispatch();

	const isSendingChannelMessage = useSelector<AppState, boolean>(state => state.channel.isSendingChannelMessage);
	const isSendingUserMessage = useSelector<AppState, boolean>(state => state.chat.isSendingUserMessage);
	const messageInputEl = useRef<HTMLInputElement>(null);

	const [ isSendingMessage, setIsSendingMessage ] = useState(false);
	useEffect(() => {
		if (isSendingChannelMessage || isSendingUserMessage) {
			setIsSendingMessage(true);
		} else {
			messageInputEl.current!.value = '';
			setIsSendingMessage(false);
		}
	}, [ isSendingChannelMessage, isSendingUserMessage ])

	const activeChatType = (): CONVERSATION_TYPE => {
		if (activeChatUser) return CONVERSATION_TYPE.CHAT;
		return CONVERSATION_TYPE.CHANNEL;
	}

	const sendMessage = (message: { type: ChatType, value: string }) => {
		if (activeChatUser && activeChatType() === CONVERSATION_TYPE.CHAT) {
			const chat: RecentChat = {
				to: activeChatUser,
				from: authUser,
				created_at: timeNow(),
				message,
			}

			dispatch(sendMessageService(chat))
		}
		
		if (activeChannel && activeChatType() === CONVERSATION_TYPE.CHANNEL) {
			const chat: ChannelChat = {
				sender_id: authUser.id,
				channel_id: activeChannel.id!,
				created_at: timeNow(),
				message,
			}

			dispatch(sendChannelMessageService(chat))
		}
	}

	const onInputKeyDown = (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;

		if (target.value === '') return;

		if (e.key === 'Enter') {
			sendMessage({ type: ChatType.TEXT, value: target.value })
		}
	}

	const onSendBtnClick = () => {
		if (messageInputEl.current?.value) {
			sendMessage({ type: ChatType.TEXT, value: messageInputEl.current.value })
		}
	}

	const openFileExplorer = () => {
		const inputEl = document.createElement('input')
		inputEl.setAttribute('type', 'file')

		inputEl.click()

		const onInputElChange = async (value: Event) => {
			const target = value.target as HTMLInputElement
			const files = (target.files || []) as File[]

			if (!files) return

			// check size of files
			for (let { size } of files) {
				if (size > Number(STORAGE_MAX_SIZE)) {
					console.error(`File too large, max file size is ${STORAGE_MAX_SIZE}`);
					return;
				}
			}

			try {
				await uploadFile({
					file: files[0],
					path: activeChatType() === CONVERSATION_TYPE.CHAT
						? chatId(authUser.id, activeChatUser!.id as number)
						: activeChannel!.id
				})
				sendMessage({ type: ChatType.FILE, value: files[0].name, })
			} catch(e) {
				// TODO: handle error ( may have to do upload rollback if db update fails)
			}
	
			inputEl.removeEventListener('input', onInputElChange)
		}

		inputEl.addEventListener('change', onInputElChange)
	}

	const shouldDisableInput = (): boolean => {
		if (activeChatType() === CONVERSATION_TYPE.CHAT && activeChatUser) return true
		if (activeChatType() === CONVERSATION_TYPE.CHANNEL && activeChannel) return true

		return false
	}

	return (
		<div className={ `message-input-container ${ !shouldDisableInput() ? 'disabled': '' }` }>
			<i className="ri-mic-2-line"></i>
			<input 
				disabled={ !shouldDisableInput() }
				className="custom" 
				type="text" 
				placeholder={ activeChatUser ? `Message ${activeChatUser.name}` : 'Send Message' } 
				onKeyDown={ onInputKeyDown }
				ref={ messageInputEl }
			/>
			{
				isSendingMessage &&
				<>
					<div className={ 'message-overlay' }></div>
					<Spinner 
						size={'20px'}
					/>
				</>
			}
			<i className="ri-add-line mx-4 cursor-pointer" onClick={ openFileExplorer }></i>
			<i className="ri-send-plane-line cursor-pointer" onClick={ onSendBtnClick }></i>
		</div>
	)
}

export default MessageInput;