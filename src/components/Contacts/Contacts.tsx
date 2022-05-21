import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './Contacts.css';

import Avatar from 'components/Avatar/Avatar';
import Modal from 'components/Modal/Modal';
import Spinner from 'components/Spinner/Spinner';
import AddContact from './AddContact/AddContact';

import store, { AppState } from 'store';
import { UserState } from 'store/user';
import { setActiveUserChat } from 'store/chat';
import { acceptContactRequestService, declineContactRequestService, fetchAcceptedContactsService, fetchPendingRequestService } from 'services/contact';

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

type AcceptedContactsProps = {
	userId: number;
	showModal: (show: boolean) => void;
}
const AcceptedContacts = (props: AcceptedContactsProps): JSX.Element => {
	const dispatch = useDispatch();
	const acceptedContacts = useSelector<AppState, User[]>(state => state.contacts.acceptedContacts);
	const isLoadingContacts = useSelector<AppState, boolean>(state => state.contacts.isLoadingContacts);

	useEffect(() => {
		if (props.userId) store.dispatch(fetchAcceptedContactsService(props.userId))
	}, [props.userId])

	const selectActiveUser = (contact: User) => {
		dispatch(setActiveUserChat(contact))
	}

	return (
		<ul>
			<li className="flex items-center text-gray-500 px-4 mb-1">
				{
					isLoadingContacts
					? <Spinner size={"15px"}/>
					: <i className="ri-user-line"></i>
				}
				<span className="inline-block ml-3 text-xs uppercase">Contacts</span>
			</li>
			{
				acceptedContacts.map((contact, index) => (
					<li className="list-item" key={ index } onClick={ () => selectActiveUser(contact) }>
						<Avatar />
						<span className="ml-3">{ contact.name }</span>
					</li>
				))
			}
			<li className="list-item text-gray-400 text-xs">
				<span className="bg-zinc-800 py-1 px-2 rounded-md flex items-center" onClick={ () => props.showModal(true) }>
					<i className="ri-add-line"></i>
					<span className="ml-2 uppercase cursor-pointer">add contact</span>
				</span>
			</li>
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
			{	
				activeUser && activeUser.id
				? <AcceptedContacts userId={ activeUser.id } showModal={ setShowModal } />
				: null
			}
			{	
				activeUser && activeUser.id
				? <PendingContacts userId={ activeUser.id }/>
				: null
			}
		</div>
	)
}

export default Contacts;