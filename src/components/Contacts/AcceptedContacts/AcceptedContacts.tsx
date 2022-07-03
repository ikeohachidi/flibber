import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from 'components/Avatar/Avatar';
import Spinner from 'components/Spinner/Spinner';

import store, { AppState } from 'store';
import { setActiveUserChat } from 'store/chat';
import { setActiveChannel } from 'store/channel';
import { fetchAcceptedContactsService} from 'services/contact';
import User from 'types/User';

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
		dispatch(setActiveChannel(null));
		dispatch(setActiveUserChat(contact));
	}

	return (
		<ul>
			<li className="flex items-center text-gray-500 px-4 mb-1">
				{
					isLoadingContacts
					? <Spinner size={"15px"}/>
					: <i className="ri-arrow-down-s-line"></i>
				}
				<span className="inline-block ml-3 text-xs uppercase">Contacts</span>

				<span 
					className="ml-auto cursor-pointer" 
					onClick={ () => props.showModal(true) }
				>
					<i className="ri-add-line"></i>
				</span>
			</li>

			{
				acceptedContacts.map((contact, index) => (
					<li className="list-item" key={ index } onClick={ () => selectActiveUser(contact) }>
						<Avatar />
						<span className="ml-3">{ contact.name }</span>
					</li>
				))
			}
		</ul>
	)
}

export default AcceptedContacts;