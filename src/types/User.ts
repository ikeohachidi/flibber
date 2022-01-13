type User = {
	id: number;
	email: string;
	name: string;
	image?: string;
	onlineState?: 'online' | 'away' | 'offline';
}

export type Credentials = {
	email: string;
	password: string;
}

export default User;