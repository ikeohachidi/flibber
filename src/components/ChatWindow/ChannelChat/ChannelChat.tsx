import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MessageList from '../MessageList/MessageList';

import '../ChatWindow.css';

import { AppState } from 'store';

import User from 'types/User';
import { Channel, ChannelChat as ChannelChatType } from 'types/Channel';
import { getChannelMessagesService } from 'services/channel';
import { channelListener } from 'supabase/channel';
import { SupabaseRealtimePayload } from '@supabase/supabase-js';
import { addMessageToChannelChat } from 'store/channel';
import { CONVERSATION_TYPE } from 'types';
import Chat, { ChatType } from 'types/Chat';
import { deleteFile as deleteFileFromStorage } from 'supabase/storage';
import { deleteChannelMessageService } from 'services/channel'

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

	const deleteMessage = async (convo: Chat | ChannelChatType): Promise<void> => {
		if (convo.message.type === ChatType.FILE) {
			await deleteFileFromStorage({
				fileName: convo.message.value,
				path: activeChannel.id 
			});
		}

		dispatch(deleteChannelMessageService(convo as ChannelChatType));
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


	return <MessageList
		chatTitle={ activeChannel.name }
		conversations={ conversations }
		authUser={ authUser }
		deleteMessageFunc={ deleteMessage }
		chatType={ CONVERSATION_TYPE.CHANNEL }
	></MessageList>;
}

export default ChannelChat;