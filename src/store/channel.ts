import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	createChannelService,
	getChannelMessagesService,
	getUserChannelsService,
	sendChannelMessageService,
	deleteChannelMessageService
} from "services/channel";
import { Channel, ChannelChat, ChannelMember } from "types/Channel";

type ChannelState = {
	activeChannel: Channel | null,
	channels: {
		metadata: Channel,
		members: ChannelMember[] 
	}[],
	loadedChannelChatIds: {[channelId: string]: true},
	channelChat: {
		[channelId: number]: ChannelChat[]
	},
	isCreatingChannel: boolean,
	isLoadingChannels: boolean,
	isFetchingChannelConversation: boolean,
	isSendingChannelMessage: boolean
}

const initialState: ChannelState = {
	activeChannel: null,
	channels: [],
	channelChat: {},
	loadedChannelChatIds: {},
	isCreatingChannel: false,
	isLoadingChannels: false,
	isFetchingChannelConversation: false,
	isSendingChannelMessage: false
}

const reducers = {
	setActiveChannel(state: ChannelState, payload: PayloadAction<Channel | null>): void {
			state.activeChannel = payload.payload;
	},
	addMessageToChannelChat(state: ChannelState, { payload }: PayloadAction<ChannelChat>): void {
		if (payload.channel_id in state.channelChat) {
			state.channelChat[payload.channel_id].push(payload);
			return;
		}

		state.channelChat[payload.channel_id] = [payload];
	}
}

const channel = createSlice({
	name: 'channel',
	initialState,
	reducers,
	extraReducers: (builder) => {
		builder
			.addCase(sendChannelMessageService.pending, (state) => {
				state.isSendingChannelMessage = true;	
			})
			.addCase(sendChannelMessageService.fulfilled, (state) => {
				state.isSendingChannelMessage = false;	
			})
			.addCase(sendChannelMessageService.rejected, (state) => {
				state.isSendingChannelMessage = false;	
			})
			.addCase(deleteChannelMessageService.fulfilled, (state, { payload }) => {
				if (!payload) return;
			
				const { channel_id, id } = payload;

				const index = state.channelChat[channel_id].findIndex(chat => chat.id === id);

				if (index < 0) return;

				state.channelChat[channel_id].splice(index, 1);
			})

			.addCase(getChannelMessagesService.pending, (state) => {
				state.isFetchingChannelConversation = true;
			})
			.addCase(getChannelMessagesService.rejected, (state) => {
				state.isFetchingChannelConversation = false;
			})
			.addCase(getChannelMessagesService.fulfilled, (state, { payload }) => {
				if (!payload) return;

				if (payload.channelId in state.channelChat) {
					return;
				}

				state.channelChat[payload.channelId] = payload.data;
				state.loadedChannelChatIds[payload.channelId] = true;
				state.isFetchingChannelConversation = false;
			})

			.addCase(createChannelService.pending, (state) => {
				state.isCreatingChannel = true;
			})
			.addCase(createChannelService.fulfilled, (state, { payload }) => {
				payload?.channel.forEach(chan => {
					state.channels.push({
						metadata: chan,
						members: [ payload?.member ]
					})
				})
				state.isCreatingChannel = false;
			})

			.addCase(getUserChannelsService.pending, (state) => {
				state.isLoadingChannels = true;
			})
			.addCase(getUserChannelsService.rejected, (state) => {
				state.isLoadingChannels = false;
			})
			.addCase(getUserChannelsService.fulfilled, (state, { payload }) => {
				if (payload && payload.data) {
					for (const value of payload?.data!) {
						state.channels.push({
							metadata: {
								id: value.id,
								name: value.name,
								scope: value.scope
							},
							members: value.users
						})
					}
				}

				state.isLoadingChannels = false;
			})
	}
})

export const { setActiveChannel, addMessageToChannelChat } = channel.actions;
export { ChannelState };
export default channel.reducer;