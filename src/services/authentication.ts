import { createAsyncThunk } from "@reduxjs/toolkit";

import User, { Credentials } from "types/User";

import { signIn } from "supabase/authentication";
import { getUser } from "supabase/user";

export const signInService = createAsyncThunk('user/setUser', async (credentials: Credentials) => {
	let { user, error } = await signIn(credentials)

	if (error) return;

	let { data, error: userError } = await getUser({ email: user?.email}, 'email')

	if (userError) return;

	return data
})