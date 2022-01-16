import { createAsyncThunk } from "@reduxjs/toolkit";
import User from "types/User";

import { acceptContactRequest, declineContactRequest, getPendingContactRequest } from "supabase/contact";

export const fetchPendingRequestService = createAsyncThunk('contact/fetchPendingRequest', async (userId: number) => {
	const { data, error } = await getPendingContactRequest(userId);

	if (error) return;

	return data?.map(value => value.user);
})

export const acceptContactRequestService = createAsyncThunk('contacts/acceptContactRequest', async (arg: { userId: number, requester: User }) => {
	const { error } = await acceptContactRequest(arg.userId, arg.requester.id);

	if (error) return

	return arg.requester;
})

export const declineContactRequestService = createAsyncThunk('contacts/declineContactRequest', async (arg: { userId: number, requester: User }) => {
	const { error } = await declineContactRequest(arg.userId, arg.requester.id);

	if (error) return

	return arg.requester;
})