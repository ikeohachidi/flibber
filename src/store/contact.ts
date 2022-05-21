import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { acceptContactRequestService, declineContactRequestService, fetchAcceptedContactsService, fetchPendingRequestService } from 'services/contact';
import User from "types/User";

// TODO: currently being used to manage loading state of pending contacts requests
// remove this and make that more explicit like isLoadingPendingContacts
enum Status {
	PENDING = 'pending',
	FULFILLED = 'fulfilled'
}

type ContactsState = {
	acceptedContacts: User[];
	pendingContacts: User[];
	status: Status;
	isLoadingContacts: boolean;
}

const initialState = {
	acceptedContacts: [],
	pendingContacts: [],
	status: Status.FULFILLED,
	isLoadingContacts: false
}

type ContactType = 'acceptedContacts' | 'pendingContacts';

const removeFromContacts = (state: ContactsState, contactType: ContactType, user: User) => {
	const index = state[contactType].findIndex(contact => contact.id === user.id)
	if (index === -1) return;

	state.pendingContacts.splice(index, 1);
}


const addContact = (state: ContactsState, contactType: ContactType, payload: User | User[]) => {
	if (payload.constructor === Array) {
		state[contactType] = payload;
		return;
	}
	state[contactType].push(payload as User);
}

const contact = createSlice({
	name: 'contact',
	initialState,
	reducers: {
		setAcceptedContacts(state: ContactsState, action: PayloadAction<User[]>) {
			state.acceptedContacts = action.payload;
		},
		setPendingContacts(state: ContactsState, action: PayloadAction<User[]>) {
			state.pendingContacts = action.payload;
		},
		removePendingContact(state: ContactsState, action: PayloadAction<User>) {
			removeFromContacts(state, 'pendingContacts', action.payload)
		},
		addAcceptedContact(state: ContactsState, action: PayloadAction<User>) {
			addContact(state, 'acceptedContacts', action.payload);
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAcceptedContactsService.pending, (state: ContactsState, action) => {
				state.isLoadingContacts = true;
			})
			.addCase(fetchAcceptedContactsService.rejected, (state: ContactsState, action) => {
				state.isLoadingContacts = false; 
			})
			.addCase(fetchAcceptedContactsService.fulfilled, (state: ContactsState, action) => {
				if (action.payload) {
					addContact(state, 'acceptedContacts', action.payload);
				}
				state.isLoadingContacts = false;
			})
			.addCase(fetchPendingRequestService.pending, (state) => {
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
			.addCase(declineContactRequestService.pending, (state) => {
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