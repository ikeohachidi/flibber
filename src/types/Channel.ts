import { Message } from './Chat';

export enum Scope {
	PRIVATE = 'private',
	PUBLIC = 'public'
}

export type Channel = {
	id: number;
	name: string;
	scope: Scope;
}

export const channelDefault = {
	id: 0,
	name: '',
	scope: Scope.PRIVATE
}

export type ChannelMember = {
	id?: number;
	channel_id?: number;
	user_id: number;
	is_admin: boolean;
}

export type MemberChannelQueryResult = ChannelMember & { 
	channel: Channel
}

export type ChannelChat = {
	id?: number;
	created_at: string;
	sender_id: number;
	channel_id: number;
	message: Message;
}