import supabase from "./supabase"
import User from 'types/User';

import { createUser } from './user';

const signUp = async (credentials: User) => {
	const {user, error} = await supabase.auth.signUp(credentials);
	if (!error) {
		await createUser(credentials);
	}
	
	return { user, error };
}

const signIn = async (credentials: User) => {
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