import supabase from "./supabase"
import User, { Credentials, UserSession } from 'types/User';

import { createUser } from './user';
import { useEffect, useState } from "react";

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

const authentictedUser = () => {
	return supabase.auth.user();
}

const useAuthState = () => {
	const [authState, setAuthState] = useState<null | UserSession>(null);

	useEffect(() => {
		supabase.auth.onAuthStateChange((event, session) => {
			switch (event) {
				case 'SIGNED_OUT':
					setAuthState(null);
					break;
				case 'SIGNED_IN':
					if (session && session.user) setAuthState(session?.user);
					break;
			}
		})
	})

	return authState;
}

export {
	signUp,
	signIn,
	signOut,
	authentictedUser,
	useAuthState
}