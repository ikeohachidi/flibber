import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendMessage } from "supabase/chat";
import Chat from "types/Chat";

export const sendMessageService = createAsyncThunk('chat/sendMessage', async (chat: Chat) => {
	const { error } = await sendMessage(chat);
	if (error) return;

	return chat;
})