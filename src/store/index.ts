import { configureStore } from '@reduxjs/toolkit';
import userReducer, { UserState } from './user';
import contactReducer, { ContactsState } from './contact';
import chatReducer, { ChatState } from './chat';
import channelReducer, { ChannelState } from './channel';

export type AppState = {
	user: UserState;
	contacts: ContactsState; 
	chat: ChatState;
	channel: ChannelState;
}

const store = configureStore({
	reducer: {
		user: userReducer,
		contacts: contactReducer,
		chat: chatReducer,
		channel: channelReducer
	}
})
// @ts-ignore
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

export default store;