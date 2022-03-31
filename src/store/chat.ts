import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import User, { UserDefault } from "types/User";
import Chat from "types/Chat";
import { getConversationService, sendMessageService } from "services/chat";

type Action<T> = PayloadAction<T>;

type ChatState = {
	activeUserChat: User;
	conversation: {
		[userId: string]: Chat[]
	};
	messageInTransit: boolean
}

const initialState: ChatState = {
	activeUserChat: UserDefault,
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
		},
		addMessageToConversation(state: ChatState, action: Action<{ authUserId: number, chat: Chat }>) {
			const { authUserId, chat } = action.payload;

			if (authUserId === chat.from) {
				if (chat.to in state.conversation) {
					state.conversation[chat.to].push(chat)
				} else {
					state.conversation[chat.to] = [chat];
				}

				return;
			}

			if (authUserId === chat.to) {
				if (chat.from in state.conversation) {
					state.conversation[chat.from].push(chat)
				} else {
					state.conversation[chat.from] = [chat];
				}

				return;
			}
		}
	},
	extraReducers: builder => {
		builder
			.addCase(sendMessageService.fulfilled, (state: ChatState, action) => {
				if (action.payload) {
					if (action.payload.to in state.conversation) {
						state.conversation[action.payload.to].push(action.payload);
					} else {
						state.conversation[action.payload.to] = [ action.payload ];
					}

					state.messageInTransit = false;
				}
			})
			.addCase(sendMessageService.pending, (state: ChatState) => {
				state.messageInTransit = true;
			})
			.addCase(getConversationService.fulfilled, (state: ChatState, action) => {
				if (action.payload && action.payload.data) {
					const { data, authUser } = action.payload;

					for (let message of data) {
						if (message.from !== authUser) {
							state.conversation[message.from] = data;
							break;
						}

						if (message.to !== authUser) {
							state.conversation[message.to] = data;
							break;
						}
					}
				}
			})
			.addCase(getConversationService.pending, (state: ChatState) => {
				state.messageInTransit = true;
			})
	}
})

export const { setActiveUserChat, setConversation, addMessageToConversation } = chat.actions;
export { ChatState };
export default chat.reducer;