import supabase from "./supabase";

import Chat, { RecentChat } from "types/Chat";
import { RealtimeSubscription, SupabaseRealtimePayload } from "@supabase/supabase-js";

export const sendMessage = async(chat: Chat) => {
	return supabase
		.from('chat')
		.insert(chat)
}

export const chatSubscribe = async(from: number, to: number, eventCallback: (payload: SupabaseRealtimePayload<Chat>) => void) => {
	return supabase
		.from('chat')
		.on('*', payload => {
			eventCallback(payload);
		})
		.subscribe()
}

export const chatUnsubscribe = async(subscription: RealtimeSubscription) => {
	return supabase.removeSubscription(subscription)
}

export const getConversation = async(chatId: number) => {
	return supabase	
		.from<Chat>('chat')
		.select('*')
		.eq('conversation_id', chatId)
}

export const getRecentChats = async(userid: number) => {
	return supabase
		.rpc<RecentChat>('get_recent_chats', { userid })
}