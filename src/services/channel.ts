import { createAsyncThunk } from "@reduxjs/toolkit";
import { Channel, ChannelMember } from "types/Channel";
import { createChannel } from "supabase/channel";

export const createChannelService = createAsyncThunk('channel/createChannel', async (payload: { channel: Channel, member: ChannelMember}) => {
	const { data, error } = await createChannel(payload.channel, payload.member)
	if (error) return;

	return {
		channel: data ?? [],
		member: payload.member
	}
})