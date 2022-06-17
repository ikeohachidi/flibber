import { useState } from 'react';
import { useSelector } from 'react-redux';

import './Contacts.css';

import Modal from 'components/Modal/Modal';
import AddContact from './AddContact/AddContact';
import PendingContacts from './PendingContacts/PendingContacts';
import AcceptedContacts from './AcceptedContacts/AcceptedContacts';

import { UserState } from 'store/user';
import User from 'types/User';

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