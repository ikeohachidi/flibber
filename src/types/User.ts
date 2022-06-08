type User = {
	id: number;
	email: string;
	name: string;
	image?: string;
	onlineState?: 'online' | 'away' | 'offline';
};

export const userDefault: User = {
	id: 0,
	email: '',
	name: '',
	image: '',
	onlineState: 'offline'
}

type Credentials = {
	email: string;
	password: string;
}

export { 
	Credentials
}

export default User;