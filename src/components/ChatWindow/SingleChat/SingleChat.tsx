import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import '../ChatWindow.css';

import MessageList from '../MessageList/MessageList';

import { AppState } from 'store';
import { getConversationService, deleteMessageService } from 'services/chat';
import { deleteFile as deleteFileFromStorage } from 'supabase/storage';
import { chatId } from 'utils/chat';

import Chat, { ChatType } from 'types/Chat'
import User from 'types/User';
import { CONVERSATION_TYPE } from 'types';
import { conversationIdGenerator } from 'utils/idGenerator';
import { ChannelChat } from 'types/Channel';

interface Props {
	authUser: User
}

const SingleChat = ({ authUser }: Props): JSX.Element => {
	const dispatch = useDispatch();

	const activeChatUser = useSelector<AppState, User>(state => state.chat.activeUserChat!);
	const loadedConversations = useSelector<AppState, {[userId: string]: true}>(state => state.chat.loadedConversations);
	const conversations = useSelector<AppState, Chat[]>(state => {
		if (activeChatUser.id in state.chat.conversation) {
			return state.chat.conversation[activeChatUser.id];
		}

		return [];
	});

	const deleteMessage = async (conversation: Chat | ChannelChat): Promise<void> => {
		if (conversation.message.type === ChatType.FILE) {
			await deleteFileFromStorage({
				fileName: conversation.message.value,
				path: conversationIdGenerator(authUser.id, activeChatUser!.id as number)
			});
		}

		dispatch(deleteMessageService(conversation as Chat));
	}

	useEffect(() => {
		if (!(activeChatUser.id in loadedConversations)) {
			dispatch(getConversationService({
				chatId: chatId(authUser.id, activeChatUser.id),
				authUser: authUser.id,
				activeChatUser: activeChatUser.id
			}))
		}
 
	}, [ activeChatUser ])

	return <MessageList
		chatTitle={ activeChatUser.name }
		conversations={ conversations }
		deleteMessageFunc={ deleteMessage }
		authUser={ authUser }
		chatType={ CONVERSATION_TYPE.CHAT }
	></MessageList>;
}

export default SingleChat;