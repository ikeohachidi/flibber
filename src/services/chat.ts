import { createAsyncThunk } from "@reduxjs/toolkit";
import { getConversation, getRecentChats, sendMessage } from "supabase/chat";
import Chat from "types/Chat";

export const sendMessageService = createAsyncThunk('chat/sendMessage', async (chat: Chat) => {
	const { error } = await sendMessage(chat);
	if (error) return;

	return chat;
})

export const getConversationService = createAsyncThunk('chat/getConversation', async(payload: { chatId: number, authUser: number }) => {
	const { data, error } = await getConversation(payload.chatId);
	if (error) return;

	return {
		authUser: payload.authUser,
		data
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