import { createSlice } from "@reduxjs/toolkit";
import { createChannelService } from "services/channel";
import { Channel, ChannelMember } from "types/Channel";

type ChannelState = {
	channels: {
		metadata: Channel,
		members: ChannelMember[] 
	}[],
	isCreatingChannel: boolean
}

const initialState: ChannelState = {
	channels: [],
	isCreatingChannel: false
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
	}
})

export { ChannelState }
export default channel.reducer;