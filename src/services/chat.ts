import { createAsyncThunk } from "@reduxjs/toolkit";
import { getConversation, sendMessage } from "supabase/chat";
import Chat from "types/Chat";

export const sendMessageService = createAsyncThunk('chat/sendMessage', async (chat: Chat) => {
	const { error } = await sendMessage(chat);
	if (error) return;

	return chat;
})

export const getConversationService = createAsyncThunk('chat/getConversation', async(people: { user1: number, user2: number, authUser: number }) => {
	const { data, error } = await getConversation(people.user1, people.user2);
	if (error) return;

	return {
		authUser: people.authUser,
		data
	};
})