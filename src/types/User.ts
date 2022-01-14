import { User as UserSession } from '@supabase/supabase-js'

type User = {
	id: number;
	email: string;
	name: string;
	image?: string;
	onlineState?: 'online' | 'away' | 'offline';
}

type Credentials = {
	email: string;
	password: string;
}

export { 
	UserSession,
	Credentials
}

export default User;