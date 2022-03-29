export enum ChatType {
	TEXT = 'text',
	IMAGE = 'image',
	VIDEO = 'video'
}

export default interface Chat {
	from: number;
	to: number;
	created_at?: string;
	message: {
		type: ChatType;
		value: string;
	}
}
