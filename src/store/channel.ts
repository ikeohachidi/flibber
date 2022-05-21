import { createSlice } from "@reduxjs/toolkit";
import { createChannelService, getUserChannelsService } from "services/channel";
import { Channel, ChannelMember } from "types/Channel";

type ChannelState = {
	channels: {
		metadata: Channel,
		members: ChannelMember[] 
	}[],
	isCreatingChannel: boolean,
	isLoadingChannels: boolean
}

const initialState: ChannelState = {
	channels: [],
	isCreatingChannel: false,
	isLoadingChannels: false
}

const channel = createSlice({
	name: 'channel',
	initialState,
	reducers: {
	},
	extraReducers: (builder) => {
		builder
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
				payload?.data.forEach(value => {
					const member = {
						is_admin: value.is_admin, 
						user_id: value.user_id
					}

					state.channels.push({
						members: [ member ],
						metadata: value.channel
					})
				})
				state.isLoadingChannels = false;
			})
	}
})

export { ChannelState }
export default channel.reducer;