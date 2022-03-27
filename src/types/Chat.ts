export enum ChatType {
	TEXT = 'text',
	IMAGE = 'image',
	VIDEO = 'video'
}

export default interface Chat {
	from: string;
	to: string;
	created_at: string;
	message: {
		type: ChatType;
		value: string;
	}
}
