import { createAsyncThunk } from "@reduxjs/toolkit";
import { Channel, ChannelMember } from "types/Channel";
import { createChannel, getUserChannels } from "supabase/channel";

export const createChannelService = createAsyncThunk('channel/createChannel', async (payload: { channel: Channel, member: ChannelMember}) => {
	const { data, error } = await createChannel(payload.channel, payload.member)
	if (error) return;

	return {
		channel: data ?? [],
		member: payload.member
	}
})

export const getUserChannelsService = createAsyncThunk('channel/getUserChannel', async (userId: number) => {
	const { data, error } = await getUserChannels(userId)
	if (error) return;

	return {
		data: data ?? []
	}
})