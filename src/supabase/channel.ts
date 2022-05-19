import supabase from './supabase';
import { Channel, ChannelMember } from 'types/Channel';
 
export const createChannel = (channel: Channel, member: ChannelMember) => {
	return supabase
		.rpc<Channel>('create_channel', {
			chan: channel,
			mem: member
		})
}