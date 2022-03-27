import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import User from "types/User";
import Chat from "types/Chat";
import { sendMessageService } from "services/chat";

type Action<T> = PayloadAction<T>;

type ChatState = {
	activeUserChat: User | null;
	conversation: {
		[userId: string]: Chat[]
	};
	messageInTransit: boolean
}

const initialState: ChatState = {
	activeUserChat: null,
	conversation: {},
	messageInTransit: false
}

const chat = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		setActiveUserChat(state: ChatState, action: Action<User>) {
			state.activeUserChat = action.payload;
		},
		setConversation(state: ChatState, action: Action<{ userId: string, conversation: Chat[] }>) {
			state.conversation[action.payload.userId] = action.payload.conversation;
		}
	},
	extraReducers: builder => {
		builder
			.addCase(sendMessageService.fulfilled, (state: ChatState, action) => {
				if (action.payload) {
					state.conversation[action.payload.to].push(action.payload);
					state.messageInTransit = false;
				}
			})
			.addCase(sendMessageService.pending, (state: ChatState) => {
				state.messageInTransit = true;
			})
	}
})

export const { setActiveUserChat } = chat.actions;
export { ChatState };
export default chat.reducer;