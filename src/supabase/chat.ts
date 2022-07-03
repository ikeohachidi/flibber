import { RealtimeSubscription, SupabaseRealtimePayload } from "@supabase/supabase-js";
import Chat, { RecentChat } from "types/Chat";
import supabase from "./supabase";


export const sendMessage = async(chat: Chat) => {
	return supabase
		.from('chat')
		.insert(chat)
}

export const chatListener = async(userId: number, eventCallback: (payload: SupabaseRealtimePayload<Chat>) => void) => {
	const connect = supabase
		.from(`chat:to=eq.${userId}`)
		.on('*', payload => {
			eventCallback(payload);
		})
		.subscribe(() => {
			console.log('realtime connection established')
		})
	
	connect.onError(() => {
		connect.rejoin()
	})

	return connect;
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

export const findMessage = async(text: string, userId: number) => {
	return supabase
		.from<Chat>('chat')
		.select(`*`)
		// @ts-expect-error 
		.ilike('message->>value', `%${text}%`)
		.or(`from.eq.${userId},to.eq.${userId}`)
}