import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import Avatar from 'components/Avatar/Avatar';

import { acceptContactRequestService, declineContactRequestService, fetchPendingRequestService } from 'services/contact';
import store, { AppState } from 'store';
import User from 'types/User';

const PendingContacts = (props: { userId: number }): JSX.Element => {
	const pendingContacts = useSelector<AppState, User[]>(state => state.contacts.pendingContacts);

	useEffect(() => {
		if (props.userId) store.dispatch(fetchPendingRequestService(props.userId))
	}, [props.userId])

	const acceptRequest = (contact: User) => {
		store.dispatch(acceptContactRequestService({ userId: props.userId, requester: contact }))
			.then(() => {
				// TODO: implement
			})
	}

	const declineRequest = (contact: User) => {
		store.dispatch(declineContactRequestService({ userId: props.userId, requester: contact }))
			.then(() => {
				// TODO: implement
			})
	}

	if (pendingContacts.length === 0) return <></>;

	return (
		<ul>
			<li className="flex items-center text-gray-500 px-4 mb-1">
				<i className="ri-information-line"></i>
				<span className="inline-block ml-3 text-xs uppercase">Pending Contacts Request</span>
			</li>
			{
				pendingContacts.map((contact, index) => (
					<li className="list-item" key={ index }>
						<Avatar />
						<span className="ml-3">{ contact.name }</span>

						<div className="text-xs ml-auto">
							<button 
								className="p-1 bg-transparent rounded-l-md rounded-r-none border bg-zinc-800  border-gray-700 border-r-0 text-green-600" 
								onClick={ () => acceptRequest(contact) }
							>
								Accept
							</button>
							<button 
								className="p-1 bg-transparent rounded-r-md rounded-l-none border bg-zinc-800 border-zinc-700 text-red-600" 
								onClick={ () => declineRequest(contact) }
							>
								Decline
							</button>
						</div>
					</li>
				))
			}
		</ul>
	)
}

export default PendingContacts;