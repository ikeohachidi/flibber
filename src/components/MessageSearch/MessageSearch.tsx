import React from 'react';
import './MessageSearch.css';
import { findMessage } from 'supabase/chat';
import Chat from 'types/Chat';

type Props = {
	onSearchResultReturned: (result: Chat[]) => void;
	onSearchTextChange: (text: string) => void;
	authUserId: number;
}

const MessageSearch = (props: Props): JSX.Element => {

	const searchMessages = (e: HTMLInputElement) => {
		props.onSearchTextChange(e.value)
		if (e.value === '') return;

		findMessage(e.value, props.authUserId)
			.then((res) => {
				if (res.data) props.onSearchResultReturned(res.data)
				else props.onSearchResultReturned([])
			})
	}

	return (
		<div className="message-search">
			<i className="ri-search-2-line"></i>
			<input 
				type="text" 
				placeholder='Search messages..'
				onInput={ (e) => searchMessages(e.target as HTMLInputElement) }
			/>
		</div>
	)
}

export default MessageSearch;