export enum Scope {
	PRIVATE = 'private',
	PUBLIC = 'public'
}

export type Channel = {
	id?: number;
	name: string;
	scope: Scope;
}

export type ChannelMember = {
	id?: number;
	channel_id?: number;
	user_id: number;
	is_admin: boolean;
}