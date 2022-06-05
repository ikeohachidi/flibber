import { createAsyncThunk } from "@reduxjs/toolkit";
import { Channel, ChannelChat, ChannelMember } from "types/Channel";
import { createChannel, getChannelMessages, getUserChannels, sendChannelMessage } from "supabase/channel";

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

export const sendChannelMessageService = createAsyncThunk( 'channel/sendMessageChat', async (chat: ChannelChat) => {
	const { data, error } = await sendChannelMessage(chat);
	if (error) return;

	return chat
})

export const getChannelMessagesService = createAsyncThunk('channel/getChannelMessage', async (channelId: number) => {
	const { data, error } = await getChannelMessages(channelId);
	if (error) return;

	return {
		channelId,
		data: data ?? []
	}
})