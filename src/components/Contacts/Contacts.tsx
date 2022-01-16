import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import './Contacts.css';

import Avatar from 'components/Avatar/Avatar';
import Modal from 'components/Modal/Modal';
import AddContact from './AddContact/AddContact';

import store, { AppState } from 'store';
import { UserState } from 'store/user';
import { acceptContactRequestService, declineContactRequestService, fetchPendingRequestService } from 'services/contact';

import User from 'types/User';

const PendingContacts = (props: { userId: number }): JSX.Element => {
	const pendingContacts = useSelector<AppState, User[]>(state => state.contacts.pendingContacts);

	useEffect(() => {
		if (props.userId) store.dispatch(fetchPendingRequestService(props.userId))
	}, [])

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

	return (
		<ul>

			<li className="flex items-center text-gray-500 px-4 mb-1">
				<i className="ri-information-line ri-lg"></i>
				<span className="inline-block ml-3 text-xs uppercase">Pending Contacts Request</span>
			</li>
			{
				pendingContacts.map((contact, index) => (
					<li className={`list-item ${ props.userId === contact.id && 'active'}`} key={ index }>
						<Avatar />
						<span className="ml-3">{ contact.name }</span>

						<div className="text-xs ml-auto">
							<button 
								className="p-2 bg-transparent rounded-l-md rounded-r-none border border-gray-700 border-r-0 text-green-600" 
								onClick={ () => acceptRequest(contact) }
							>
								Accept
							</button>
							<button 
								className="p-2 bg-transparent rounded-r-md rounded-l-none border border-gray-700 text-red-500" 
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

const Contacts = (): JSX.Element => {
	const activeUser = useSelector<{ user: UserState }, User>(state => state.user.user as User);

	const [ showModal, setShowModal ] = useState(false);

	return (
		<div>
			<Modal show={ showModal } onClose={ () => setShowModal(false) }>
				<AddContact user={ activeUser }/>
			</Modal>
			<p className="flex items-center text-gray-500 px-4 mb-3">
				<i className="ri-arrow-down-s-line"></i>
				<span className="inline-block ml-3 text-xs uppercase">contacts</span>
			</p>
			<ul className="mb-3">
				<li className="list-item text-gray-500 text-xs">
					<i className="ri-add-line"></i>
					<span className="ml-2 uppercase cursor-pointer" onClick={ () => setShowModal(true) }>add contact</span>
				</li>
			</ul>
			{	
				activeUser && activeUser.id
				? <PendingContacts userId={ activeUser.id }/>
				: null
			}
		</div>
	)
}

export default Contacts;