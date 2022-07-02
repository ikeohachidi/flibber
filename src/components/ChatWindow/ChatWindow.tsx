import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MessageInput from './MessageInput/MessageInput';
import SingleChat from './SingleChat/SingleChat';
import Spinner from 'components/Spinner/Spinner';

import './ChatWindow.css';

import { AppState } from 'store';

import User from 'types/User';
import { Channel } from 'types/Channel';

const ChatWindow = (): JSX.Element => {
	const dispatch = useDispatch();

	const activeChatUser = useSelector<AppState, User | null>(state => state.chat.activeUserChat);
	const activeChannel = useSelector<AppState, Channel | null>(state => state.channel.activeChannel);
	const authUser = useSelector<AppState, User>(state => state.user.user!);
	const isFetchingSingleConversation = useSelector<AppState, boolean>(state => state.chat.isFetchingConversation);

	const isLoading = (): boolean => {
		if (isFetchingSingleConversation) return true;

		return false;
	}

	const chatType = (): 'user' | 'channel' | 'none' => {
		if (activeChannel && activeChannel.id) {
			return 'channel';
		}

		if (activeChatUser && activeChatUser.id) {
			return 'user';
		}

		return 'none';
	}


	const ChatTypeDisplay = () => {
		switch (chatType()) {
			case 'user':
				return <SingleChat authUser={ authUser }/>
			case 'channel':
				return <h1>Channel</h1>
			default:
				return <h1>Neither</h1>
		}
	}

	return (
		<section className="chat-container">

			{
				isLoading()
				? <Spinner 
					fullSize={ true }
				/>
				: <ChatTypeDisplay />
			}
			
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