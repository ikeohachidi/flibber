import supabase from './supabase';
import { Channel, ChannelMember, MemberChannelQueryResult } from 'types/Channel';
 
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