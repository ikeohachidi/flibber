import supabase from "./supabase";

import Chat from "types/Chat";

export const sendMessage = async(chat: Chat) => {
	return supabase
		.from('chat')
		.insert(chat)
}