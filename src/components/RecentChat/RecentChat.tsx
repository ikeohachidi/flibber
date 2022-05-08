import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './RecentChat.css';

import Avatar from 'components/Avatar/Avatar';
import MessageSearch from 'components/MessageSearch/MessageSearch';

import { timeFromNow } from 'utils/date';
import { getRecentConversations } from 'services/chat';

import User from 'types/User';
import Chat, { RecentChat } from 'types/Chat';

import { AppState } from 'store';
import { setActiveUserChat } from 'store/chat';

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
							<div className="message-item-time">{ timeFromNow(message.created_at) }</div>
							<div className="message-item-contact">
								{ authUserId && getChatParticipant(message, authUserId).name }
							</div>
							<div className="message-item-chat">
								{ message.from.id === authUserId && 'You: ' }
								{ message.message.value }
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
		return contacts.find(contact => contact.id === participant);
	}

	return (
		<ul>
			{
				results.map((result, index) => (
					<li key={ index } className="message-item">
						<div className="message-item-metadata">
							<div className="message-item-contact">
								{ (authUserId && findParticipant(result)) && findParticipant(result)?.name }
							</div>
							<div className="message-item-chat">
								{ result.from === authUserId && 'You: ' }
								{ result.message.value }
							</div>
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

	const [searchResults, setSearchResult] = useState<Chat[]>([]);
	const [ searchText, setSearchText ] = useState('');

	useEffect(() => {
		if (!authUserId) return;

		dispatch(getRecentConversations(authUserId))
	}, [ authUserId ])

	const selectUser = (user?: User) => {
		if (user) {
			dispatch(setActiveUserChat(user))
		}
	}

	const displaySearchResult = () => {
		return searchText && (searchResults && searchResults.length > 0)
	}

	return (
		<div className="message-container">
			<div className="search-wrapper">
				<MessageSearch 
					onSearchResultReturned={ setSearchResult }
					onSearchTextChange={ setSearchText }
					authUserId={ authUserId! }
				/>
			</div>
			{
				displaySearchResult()
				?  <SearchResult
					contacts={ contacts }
					results={ searchResults }
					authUserId={ authUserId! }
				/>
				: <ContactsMessage
					recentConversations={ recentConversations }
					authUserId={ authUserId! }
					onUserClick={ selectUser }
				/>
			}
		</div>
	)
}

export default Recent;