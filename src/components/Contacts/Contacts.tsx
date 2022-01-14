import { useState } from 'react';

import './Contacts.css';

import Avatar from 'components/Avatar/Avatar';
import Modal from 'components/Modal/Modal';
import AddContact from './AddContact/AddContact';

const Contacts = (): JSX.Element => {
	const contacts = [
		{
			messages: [],
			unread: 3,
			user: {
				id: 33,
				email: 'ikeohachidi@gmail.com',
				name: 'Ikeoha Chidi'
			}
		},
		{
			messages: [],
			unread: 3,
			user: {
				id: 33,
				email: 'ikeohachidi@gmail.com',
				name: 'Ikeoha Chidi'
			}
		}
	];

	const activeUserId = 0; 

	const [ showModal, setShowModal ] = useState(false);

	const contactsList = contacts.map((contact, index) => (
		<li className={`list-item ${ activeUserId === contact.user.id && 'active'}`} key={ index }>
			<Avatar />
			<span className="ml-3">{ contact.user.name }</span>
			<span className="rounded-xl ml-auto text-xs bg-gray-800 py-1 px-2">
				{
					contact.unread && contact.unread > 0
					? <span>{ contact.unread }</span>
					: ''
				}
			</span>
		</li>
	))

	return (
		<div>
			<Modal show={ showModal } onClose={ () => setShowModal(false) }>
				<AddContact/>
			</Modal>
			<p className="flex items-center text-gray-500 px-4 mb-3">
				<i className="ri-arrow-down-s-line"></i>
				<span className="inline-block ml-3 text-xs uppercase">contacts</span>
			</p>
			<ul>
				{ contactsList }
				<li className="list-item text-gray-500 text-xs">
					<i className="ri-add-line"></i>
					<span className="ml-2 uppercase" onClick={ () => setShowModal(true) }>add contact</span>
				</li>
			</ul>
		</div>
	)
}

export default Contacts;