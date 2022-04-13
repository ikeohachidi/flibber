import User from "./User";

export enum ChatType {
	TEXT = 'text',
	IMAGE = 'image',
	VIDEO = 'video'
}

interface Message {
	type: ChatType;
	value: string;
}
export default interface Chat {
	from: number;
	to: number;
	created_at?: string;
	conversation_id: number;
	message: Message 
}

export interface RecentChat {
	from: User;
	to: User;
	created_at: string;
	message: Message;
}