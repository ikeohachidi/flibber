import { configureStore } from '@reduxjs/toolkit';
import userReducer, { UserState } from './user';
import contactReducer, { ContactsState } from './contact';
import chatReducer, { ChatState } from './chat';

export type AppState = {
	user: UserState;
	contacts: ContactsState; 
	chat: ChatState;
}

const store = configureStore({
	reducer: {
		user: userReducer,
		contacts: contactReducer,
		chat: chatReducer
	}
})

export default store;