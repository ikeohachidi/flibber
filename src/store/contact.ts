import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchPendingRequestService } from 'services/contact';
import User from "types/User";

type Action = PayloadAction<User[] | Status>

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
		setAcceptedContacts(state: ContactsState, action: Action) {
			state.acceptedContacts = action.payload as User[];
		},
		setPendingContacts(state: ContactsState, action: Action) {
			state.pendingContacts = action.payload as User[];
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