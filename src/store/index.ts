import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import contactReducer, { ContactsState } from './contact';
import chatReducer, { ChatState } from './chat';
import User from 'types/User';

export type AppState = {
	user: User;
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