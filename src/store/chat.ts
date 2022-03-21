import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import User from "types/User";

type Action<T> = PayloadAction<T>;

type ChatState = {
	activeUserChat: User | null;
}

const initialState = {
	activeUserChat: null
}

const chat = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		setActiveUserChat(state: ChatState, action: Action<User>) {
			state.activeUserChat = action.payload;
		}
	}
})

export const { setActiveUserChat } = chat.actions;
export { ChatState };
export default chat.reducer;