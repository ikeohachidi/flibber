import React from 'react';
import { useSelector } from 'react-redux';

import MessageInput from './MessageInput/MessageInput';
import SingleChat from './SingleChat/SingleChat';
import ChannelChat from './ChannelChat/ChannelChat';
import Spinner from 'components/Spinner/Spinner';

import './ChatWindow.css';

import { AppState } from 'store';

import User from 'types/User';
import { Channel } from 'types/Channel';

const ChatWindow = (): JSX.Element => {
	const activeChatUser = useSelector<AppState, User | null>(state => state.chat.activeUserChat);
	const activeChannel = useSelector<AppState, Channel | null>(state => state.channel.activeChannel);
	const authUser = useSelector<AppState, User>(state => state.user.user!);
	const isFetchingSingleConversation = useSelector<AppState, boolean>(state => state.chat.isFetchingConversation);
	const isFetchingChannelConversation = useSelector<AppState, boolean>(state => state.channel.isFetchingChannelConversation)

	const isLoading = (): boolean => {
		if (isFetchingSingleConversation || isFetchingChannelConversation) return true;

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
				return <SingleChat authUser={ authUser } />
			case 'channel':
				return <ChannelChat authUser={authUser}/>
			default:
				return <span></span>
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