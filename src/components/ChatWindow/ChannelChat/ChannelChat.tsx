import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from 'components/Avatar/Avatar';
import ChatDetails from '../ChatDetails/ChatDetails';

import '../ChatWindow.css';

import { AppState } from 'store';

import { ChatType } from 'types/Chat'
import User from 'types/User';
import { Channel, ChannelChat as ChannelChatType } from 'types/Channel';
import { getChannelMessagesService } from 'services/channel';
import { channelListener } from 'supabase/channel';
import { SupabaseRealtimePayload } from '@supabase/supabase-js';
import { addMessageToChannelChat } from 'store/channel';


/**
 * checks if a single user has sent consecutive messages without another
 * person sending a message
 * @param Message message object
 * @returns boolean
 */
const isMessageInAStreak = (messageIndex: number, messages: ChannelChatType[]) => {
	if (messages.length === 0 || messageIndex === 0) return false;

	const presentChat = messages[messageIndex];
	const prevChat  = messages[messageIndex - 1];

	return presentChat.sender_id === prevChat.sender_id
}


interface Props {
	authUser: User
}

const ChannelChat = ({ authUser }: Props): JSX.Element => {
	const dispatch = useDispatch();

	const activeChannel = useSelector<AppState, Channel>(state => state.channel.activeChannel!);
	const loadedChannelChatIds = useSelector<AppState, {[channelId: string]: true}>(state => state.channel.loadedChannelChatIds);
	const conversations = useSelector<AppState, ChannelChatType[]>(state => {
		if (activeChannel.id! in state.channel.channelChat) {
			return state.channel.channelChat[activeChannel.id!]
		}

		return [];
	});

	const isSignedInUserSender = (senderId: number) => senderId === authUser.id;

	const chatDetailsEl = useRef<HTMLDivElement>(null);
	const toggleChatDetails = (state: boolean): void => {
		if (state) {
			chatDetailsEl.current?.classList.remove('hide');
		} else {
			chatDetailsEl.current?.classList.add('hide');
		}
	}

	useEffect(() => {
		if (activeChannel.id! in loadedChannelChatIds) return;
		dispatch(getChannelMessagesService(activeChannel.id!))

		// TODO: ideally this should be in Application.tsx but supabase currently doesn't
		// have a way to listen for realtime events using foreign keys
		channelListener(activeChannel.id!, (payload: SupabaseRealtimePayload<ChannelChatType>) => {
			dispatch(addMessageToChannelChat({
				...payload.new
			}))
		})
	}, [ activeChannel, loadedChannelChatIds ])

	return (
		<>
			<div className="chat-details hide" ref={ chatDetailsEl }>
				<ChatDetails onCloseClick={ () => toggleChatDetails(false) }/>
			</div>
			<div className="chat-banner">
				<span>
					{ activeChannel.name }
				</span>
				<i className="ri-more-fill" onClick={ () => toggleChatDetails(true) }></i>
			</div>

			<div className="chat-box">
				{
					conversations.map((conversation, index) => (
						<div 
							className={ `chat ${isSignedInUserSender(conversation.sender_id) ? 'sending' : 'receiving'}` } 
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
		</> 
	)
}

export default ChannelChat;