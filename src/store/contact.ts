import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { acceptContactRequestService, declineContactRequestService, fetchPendingRequestService } from 'services/contact';
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

type ContactType = 'acceptedContacts' | 'pendingContacts';

const removeFromContacts = (state: ContactsState, contactType: ContactType, user: User) => {
	const index = state[contactType].findIndex(contact => contact.id === user.id)
	if (index === -1) return;

	state.pendingContacts.splice(index, 1);
}


const addContact = (state: ContactsState, contactType: ContactType, user: User) => {
	state[contactType].push(user);
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
		removePendingContact(state: ContactsState, action: Action<User>) {
			removeFromContacts(state, 'pendingContacts', action.payload)
		},
		addAcceptedContact(state: ContactsState, action: Action<User>) {
			addContact(state, 'acceptedContacts', action.payload);
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPendingRequestService.pending, (state, action) => {
				state.status = Status.PENDING;
			})
			.addCase(fetchPendingRequestService.fulfilled, (state: ContactsState, action) => {
				state.pendingContacts = action.payload as User[];
			})
			.addCase(acceptContactRequestService.fulfilled, (state: ContactsState, action) => {
				if (action.payload) {
					removeFromContacts(state, 'pendingContacts', action.payload);
					addContact(state, 'acceptedContacts', action.payload);
				}
			})
			.addCase(declineContactRequestService.pending, (state, action) => {
				state.status = Status.PENDING;
			})
			.addCase(declineContactRequestService.fulfilled, (state: ContactsState, action) => {
				if (action.payload) {
					removeFromContacts(state, 'pendingContacts', action.payload);
				}
			})
	}
})

export const { setAcceptedContacts, setPendingContacts } = contact.actions;
export { ContactsState };
export default contact.reducer;