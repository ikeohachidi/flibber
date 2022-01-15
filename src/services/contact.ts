import { createAsyncThunk } from "@reduxjs/toolkit";

import { getPendingContactRequest } from "supabase/contact";

export const fetchPendingRequestService = createAsyncThunk('contact/fetchPendingRequest', async (userId: number) => {
	const { data, error } = await getPendingContactRequest(userId);

	if (error) return;

	return data?.map(value => value.user);
})