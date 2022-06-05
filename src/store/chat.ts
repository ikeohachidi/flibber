import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import User  from "types/User";
import Chat, { RecentChat } from "types/Chat";
import { getConversationService, getRecentConversations, sendMessageService } from "services/chat";

type ChatState = {
	activeUserChat: User | null;
	conversation: {
		[userId: string]: Chat[]
	};
	loadedConversations: number[],
	recentConversations: {
		[userId: string]: RecentChat
	}
	messageInTransit: boolean,
	isFetchingConversation: boolean,
	isFetchingRecentConversation: boolean
}

const initialState: ChatState = {
	activeUserChat: null,
	loadedConversations: [],
	conversation: {},
	recentConversations: {},
	messageInTransit: false,
	isFetchingConversation: false,
	isFetchingRecentConversation: false
}

const reducers = {
	setActiveUserChat(state: ChatState, action: PayloadAction<User | null>) {
		state.activeUserChat = action.payload;
	},
	setConversation(state: ChatState, action: PayloadAction<{ userId: string, conversation: Chat[] }>) {
		state.conversation[action.payload.userId] = action.payload.conversation;
	},
	addMessageToConversation(state: ChatState, action: PayloadAction<{ authUserId: number, chat: Chat }>) {
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
	},
	setRecentConversation(state: ChatState, action: PayloadAction<{ authUserId: number, conversation: RecentChat }>) {
		
		const { authUserId, conversation }	= action.payload;

		const particpant = conversation.from.id === authUserId ? conversation.to : conversation.from;

		state.recentConversations[particpant.id] = conversation;
	}
}

const chat = createSlice({
	name: 'chat',
	initialState,
	reducers,
	extraReducers: builder => {
		builder
			.addCase(sendMessageService.fulfilled, (state: ChatState, action) => {
				if (action.payload) {
					const { recentChat, chat } = action.payload;

					reducers.addMessageToConversation(state, {
						payload: {
							authUserId: chat.from,
							chat,
						},
						type: 'chat/addMessageToConversation'
					})

					reducers.setRecentConversation(state, { 
						payload: {
							authUserId: chat.from,
							conversation: recentChat 
						},
						type: 'chat/setRecentConversation'
					})					

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
						let particpant = message.to;

						if (message.to === authUser) particpant = message.from

						state.loadedConversations.push(particpant)
						state.conversation[particpant] = data;

						break;
					}

					state.isFetchingConversation = false;
				}
			})
			.addCase(getConversationService.rejected, (state: ChatState) => {
				state.isFetchingConversation = false;
			})
			.addCase(getConversationService.pending, (state: ChatState) => {
				state.isFetchingConversation = true;
			})
			.addCase(getRecentConversations.pending, (state: ChatState, action) => {
				state.isFetchingRecentConversation = true;
			})
			.addCase(getRecentConversations.rejected, (state: ChatState, action) => {
				state.isFetchingRecentConversation = false;
			})
			.addCase(getRecentConversations.fulfilled, (state: ChatState, action) => {
				if (action.payload && action.payload.data) {
					const { authUser } = action.payload;

					action.payload.data.forEach(conversation => {
						const particpant = conversation.from.id === authUser ? conversation.to : conversation.from 

						if ((particpant.id in state.recentConversations) === false) {
							state.recentConversations[particpant.id] = conversation;
						}
					})
				}

				state.isFetchingRecentConversation = false;
			})
	}
})

export const { setActiveUserChat, setConversation, addMessageToConversation, setRecentConversation } = chat.actions;
export { ChatState };
export default chat.reducer;