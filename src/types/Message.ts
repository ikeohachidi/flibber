import User from './User';

export interface Message {
	sender: User;
	chat: {
		type: ChatType;
		value: string;
	}
}

export enum ChatType {
	TEXT = 'text',
	IMAGE = 'image',
	VIDEO = 'video'
}