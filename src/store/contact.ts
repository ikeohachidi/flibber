import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchPendingRequestService } from 'services/contact';
import User from "types/User";

type Action<T> = PayloadAction<T>

enum Status {
	PENDING = 'pending',
	FULFILLED = 'fulfilled'
}

type ContactsState = {
	acceptedContacts: User[];
	pendingContacts: User[];
	status: Status;
}

const initialState = {
	acceptedContacts: [],
	pendingContacts: [],
	status: Status.FULFILLED 
}

const contact = createSlice({
	name: 'contact',
	initialState,
	reducers: {
		setAcceptedContacts(state: ContactsState, action: Action<User[]>) {
			state.acceptedContacts = action.payload;
		},
		setPendingContacts(state: ContactsState, action: Action<User[]>) {
			state.pendingContacts = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPendingRequestService.pending, (state, action) => {
				state.status = Status.PENDING;
			})
			.addCase(fetchPendingRequestService.fulfilled, (state: ContactsState, action) => {
				state.pendingContacts = action.payload as User[];
			})
	}
})

export const { setAcceptedContacts, setPendingContacts } = contact.actions;
export { ContactsState };
export default contact.reducer;