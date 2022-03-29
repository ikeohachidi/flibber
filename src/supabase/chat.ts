import supabase from "./supabase";

import Chat from "types/Chat";
import { RealtimeSubscription } from "@supabase/supabase-js";

export const sendMessage = async(chat: Chat) => {
	return supabase
		.from('chat')
		.insert(chat)
}

export const chatSubscribe = async(from: number, to: number) => {
	return supabase
		.from(`chat:from=eq.${from}.and.to=eq.${to}`)
		.on('*', payload => {
			console.log(payload)
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