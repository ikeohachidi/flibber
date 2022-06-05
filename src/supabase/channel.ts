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
		.from<MemberChannelQueryResult>('channel_member')
		.select(`
			channel:channel_id (*),
			user_id,
			is_admin
		`)
		.eq('user_id', userId)
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