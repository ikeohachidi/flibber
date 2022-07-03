import { SupabaseRealtimePayload } from '@supabase/supabase-js';
import { Channel, ChannelChat, ChannelMember, MemberChannelQueryResult } from 'types/Channel';
import supabase from './supabase';
 
export const createChannel = (channel: Channel, member: ChannelMember) => {
	return supabase
		.rpc<Channel>('create_channel', {
			chan: channel,
			mem: member
		})
}

export const getUserChannels = (userId: number) => {
	return supabase
		.rpc('get_connected_channels', { userid: userId })
}

export const sendChannelMessage = async(chat: ChannelChat) => {
	return supabase
		.from('channel_chat')
		.insert(chat)
}


export const getChannelMessages = async(channelId: number) => {
	return supabase	
		.from<ChannelChat>('channel_chat')
		.select('*')
		.eq('channel_id', channelId)
}

export const channelListener = async(channelId: number, eventCallback: (payload: SupabaseRealtimePayload<ChannelChat>) => void) => {
	const connect = supabase
		.from(`channel_chat:channel_id=eq.${channelId}`)
		.on('*', payload => {
			eventCallback(payload);
		})
		.subscribe(() => {
			console.log('realtime channel connection established')
		})
	
	connect.onError(() => {
		connect.rejoin()
	})

	return connect;
}