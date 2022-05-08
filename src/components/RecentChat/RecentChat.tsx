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

const getChatParticipant = (chat: RecentChat, userId: number) => {
	if (chat.from.id === userId) return chat.to;
	return chat.from;
}

const ContactsMessage = ({ authUserId }: { authUserId: number }): JSX.Element => {
	const dispatch = useDispatch();
	const recentConversations = useSelector<AppState, RecentChat[]>(state => Object.values(state.chat.recentConversations));

	useEffect(() => {
		if (!authUserId) return;

		dispatch(getRecentConversations(authUserId))
	}, [ authUserId ])

	const selectUser = (user?: User) => {
		if (user) {
			dispatch(setActiveUserChat(user))
		}
	}

	return (
		<ul>
			{
				recentConversations.map((message, index) => (
					<div className="message-item" key={ index } onClick={ () => selectUser(getChatParticipant(message, authUserId!)) }>
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
}

const SearchResult = ({ authUserId, results }: SearchResultProps): JSX.Element => {
	const contacts = useSelector((state: AppState) => state.contacts.acceptedContacts);

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
	const authUserId = useSelector<AppState, number | undefined>(state => state.user.user?.id);
	const [searchResults, setSearchResult] = useState<Chat[]>([]);
	const [ searchText, setSearchText ] = useState('');

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
					results={ searchResults }
					authUserId={ authUserId! }
				/>
				: <ContactsMessage 
					authUserId={ authUserId! }
				/>
			}
		</div>
	)
}

export default Recent;