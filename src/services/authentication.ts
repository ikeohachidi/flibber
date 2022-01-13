import supabase from "./supabase"
import User, { Credentials } from 'types/User';

import { createUser } from './user';

type UserCredentials = Partial<User & Credentials>;

const signUp = async (credentials: UserCredentials) => {
	const { user, error } = await supabase.auth.signUp(credentials);
	if (!error) {
		const { error } = await createUser({
			email: credentials.email,
			name: credentials.name
		})
	}
	
	return { user, error };
}

const signIn = async (credentials: Credentials) => {
	const { user, error } = await supabase.auth.signIn(credentials);

	return { user, error };
}

const signOut = async () => {
	const { error } = await supabase.auth.signOut();
	return error;
}

export {
	signUp,
	signIn,
	signOut
}