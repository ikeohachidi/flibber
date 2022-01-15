import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import './Contacts.css';

import Avatar from 'components/Avatar/Avatar';
import Modal from 'components/Modal/Modal';
import AddContact from './AddContact/AddContact';

import store, { AppState } from 'store';
import { UserState } from 'store/user';
import { fetchPendingRequestService } from 'services/contact';

import User from 'types/User';

const PendingContacts = (props: { userId: number }): JSX.Element => {
	const pendingContacts = useSelector<AppState, User[]>(state => state.contacts.pendingContacts);

	useEffect(() => {
		if (props.userId) store.dispatch(fetchPendingRequestService(props.userId))
	}, [])

	return (
		<ul>
			{
				pendingContacts.map((contact, index) => (
					<li className={`list-item ${ props.userId === contact.id && 'active'}`} key={ index }>
						<Avatar />
						<span className="ml-3">{ contact.name }</span>
						{/* <span className="rounded-xl ml-auto text-xs bg-gray-800 py-1 px-2">
							{
								contact.unread && contact.unread > 0
								? <span>{ contact.unread }</span>
								: ''
							}
						</span> */}
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
			<ul>
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