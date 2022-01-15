import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import contactReducer, { ContactsState } from './contact';
import User from 'types/User';

export type AppState = {
	user: User;
	contacts: ContactsState; 
}

const store = configureStore({
	reducer: {
		user: userReducer,
		contacts: contactReducer
	}
})

export default store;