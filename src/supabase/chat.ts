import supabase from "./supabase";

import Chat from "types/Chat";
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

export const getConversation = async(user1: number, user2: number) => {
	return supabase	
		.from<Chat>('chat')
		.select('*')
		.or(`from.eq.${user1},and(to.eq.${user2}), from.eq.${user2},and(to.eq.${user1})`)
}