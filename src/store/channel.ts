import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createChannelService, getChannelMessagesService, getUserChannelsService, sendChannelMessageService } from "services/channel";
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
	isFetchingChannelConversation: boolean
}

const initialState: ChannelState = {
	activeChannel: null,
	channels: [],
	channelChat: {},
	loadedChannelChatIds: {},
	isCreatingChannel: false,
	isLoadingChannels: false,
	isFetchingChannelConversation: false
}

const channel = createSlice({
	name: 'channel',
	initialState,
	reducers: {
		setActiveChannel(state: ChannelState, payload: PayloadAction<Channel | null>): void {
			state.activeChannel = payload.payload;
		}
	},
	extraReducers: (builder) => {
		builder
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
			.addCase(sendChannelMessageService.fulfilled, (state, { payload }) => {
				if (!payload) return;

				if (payload.channel_id in state.channelChat) {
					state.channelChat[payload.channel_id].push(payload);
					return;
				}

				state.channelChat[payload.channel_id] = [payload];
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

export const { setActiveChannel } = channel.actions;
export { ChannelState };
export default channel.reducer;