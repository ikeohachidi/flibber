import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './RecentChat.css';

import Avatar from 'components/Avatar/Avatar';
import MessageSearch from 'components/MessageSearch/MessageSearch';
import Spinner from 'components/Spinner/Spinner';

import { timeFromNow } from 'utils/date';
import { getRecentConversations } from 'services/chat';

import User from 'types/User';
import Chat, { RecentChat } from 'types/Chat';

import { AppState } from 'store';
import { setActiveUserChat } from 'store/chat';
import { setActiveChannel } from 'store/channel';

type ContactsMessageProps = {
	authUserId: number;
	recentConversations: RecentChat[];
	onUserClick: (user: User) => void;
}

const ContactsMessage = ({ authUserId, recentConversations, onUserClick }: ContactsMessageProps): JSX.Element => {
	const getChatParticipant = (chat: RecentChat, userId: number) => {
		if (chat.from.id === userId) return chat.to;
		return chat.from;
	}

	return (
		<ul>
			{
				recentConversations.map((message, index) => (
					<div className="message-item" key={ index } onClick={ () => onUserClick(getChatParticipant(message, authUserId!)) }>
						<div className="mr-2 mt-1">
							<Avatar/>
						</div>
						<div className="message-item-metadata">
							<div className="message-item-contact">
								{ authUserId && getChatParticipant(message, authUserId).name }
							</div>
							<div className="message-item-chat">
								<p>
									{ message.from.id === authUserId && 'You: ' }
									{ message.message.value }
								</p>
								<div className="message-item-time">{ timeFromNow(message.created_at) }</div>
							</div>
						</div>
					</div>
				))
			}
		</ul>
	)
}

type SearchResultProps = {
	authUserId: number;
	results: Chat[];
	contacts: User[];
}

const SearchResult = ({ authUserId, results, contacts }: SearchResultProps): JSX.Element => {
	const findParticipant = (result: Chat) => {
		const participant = result.from === authUserId ? result.to : result.from;
		return getContact(participant);
	}

	const getContact = (userId: number) => {
		return contacts.find(contact => contact.id === userId);
	}

	const groupResultsByUser = () => {
		const body: {user: User; messages: Chat[]}[] = [];
		const lookup: {[email: string]: number} = {};

		results.forEach(result => {
			const participant = findParticipant(result)!;

			if (participant.email in lookup) {
				const index = lookup[participant.email];
				body[index].messages.push(result)
			} else {
				lookup[participant.email] = body.length;
				body.push({
					user: participant,
					messages: [ result ]
				})
			}
		})

		return body;
	}

	return (
		<ul>
			{
				groupResultsByUser().map((result, index) => (
					<li key={ index } className="message-item">
						<div className="message-item-metadata">
							<div className="message-item-contact">
								{ getContact(result.user.id)?.name }
							</div>
							{
								result.messages.map((message, mIndex) => (
									<div className="message-item-chat my-2" key={`m-${mIndex}`}>
										<p>
											{ message.from === authUserId && 'You: ' }
											{ message.message.value }
										</p>
										<div className="message-item-time">{ timeFromNow(message.created_at!) }</div>
									</div>
								))
							}
						</div>
					</li>		
				))
			}
		</ul>
	)
}

const Recent = (): JSX.Element => {
	const dispatch = useDispatch();

	const authUserId = useSelector<AppState, number | undefined>(state => state.user.user?.id);
	const contacts = useSelector((state: AppState) => state.contacts.acceptedContacts);
	const recentConversations = useSelector<AppState, RecentChat[]>(state => Object.values(state.chat.recentConversations));
	const isFetchingRecentConversation = useSelector<AppState, boolean>(state => state.chat.isFetchingRecentConversation);

	const [ searchResults, setSearchResult ] = useState<Chat[]>([]);
	const [ searchText, setSearchText ] = useState('');
	const [ isSearching, setIsSearching ] = useState(false);

	useEffect(() => {
		if (!authUserId) return;

		dispatch(getRecentConversations(authUserId))
	}, [ authUserId ])

	const selectUser = (user?: User) => {
		if (user) {
			dispatch(setActiveUserChat(user));
			dispatch(setActiveChannel(null));
		}
	}

	const onMessageSearch = (isSearching: boolean): void => {
		setIsSearching(isSearching);
	}

	let recentChatBody: JSX.Element;

	if (isSearching) {
		recentChatBody = <p className="px-3 text-white">Searching Messages please wait</p>
	} 
	else if (!isSearching && searchText !== '' && searchResults.length === 0) {
		recentChatBody = <p className="px-3 text-white">Search returned no results</p>
	} 
	else if (searchResults.length > 0 && searchText !== '') {
		recentChatBody = <SearchResult
			contacts={ contacts }
			results={ searchResults }
			authUserId={ authUserId! }
		/>
	} 
	else {
		recentChatBody = <ContactsMessage
			recentConversations={ recentConversations }
			authUserId={ authUserId! }
			onUserClick={ selectUser }
		/>
	}

	return (
		<div className="message-container">
			{
				isFetchingRecentConversation &&
				<Spinner 
					fullSize={ true }
				/>
			}
			<div className="search-wrapper">
				<MessageSearch 
					onSearchResultReturned={ setSearchResult }
					onSearchTextChange={ setSearchText }
					authUserId={ authUserId! }
					onSearch={ onMessageSearch }
				/>
			</div>
			{ recentChatBody }
		</div>
	)
}

export default Recent;