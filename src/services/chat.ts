import { createAsyncThunk } from "@reduxjs/toolkit";
import { getConversation, getRecentChats, sendMessage } from "supabase/chat";
import Chat, { RecentChat } from "types/Chat";
import { chatId } from "utils/chat";

export const sendMessageService = createAsyncThunk('chat/sendMessage', async (recent: RecentChat) => {
	const chat: Chat = {
		to: recent.to.id,
		from: recent.from.id,
		conversation_id: chatId(recent.to.id, recent.from.id),
		message: recent.message
	}

	if ('scope' in recent.to) {
		chat.conversation_id = recent.to.id;
	}

	const { error } = await sendMessage(chat);
	if (error) return;

	return {
		chat,
		recentChat: recent
	}
})

export const getConversationService = createAsyncThunk('chat/getConversation', async(payload: { chatId: number, authUser: number, activeChatUser: number }) => {
	const { data, error } = await getConversation(payload.chatId);
	if (error) return { ...payload, data: [] };

	return {
		data,
		...payload,
	};
})

export const getRecentConversations = createAsyncThunk('chat/getRecentConversations', async(userid: number) => {
	const { data, error } = await getRecentChats(userid)
	if (error) return;

	return {
		authUser: userid,
		data
	}
})