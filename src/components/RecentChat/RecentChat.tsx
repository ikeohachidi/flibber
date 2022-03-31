import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'store';
import User from 'types/User';
import Avatar from 'components/Avatar/Avatar';
import './RecentChat.css';

const ContactsMessage = (): JSX.Element => {
	const activeChatUser = useSelector<AppState, User | null>(state => state.chat.activeUserChat);
	const authUserId = useSelector<AppState, number | undefined>(state => state.user.user?.id)

	const [messages, setMessages] = useState([
		{
			contact: { name: 'JR Smith', id: 4, email: 'jr123@gmail.com' },
			lastMessage: {
				sender: { name: 'JR Smith', id: 4, email: 'jr123@gmail.com' },
				time: '10: 24 AM',
				text: 'Lorem ipsum dolor imat'
			},
			isGroup: false,
			unread: 0,
		}
	])

	useEffect(() => {
		if (activeChatUser === null) return;

		const index = messages.findIndex(message => message.contact.id === activeChatUser?.id);

		if (index !== -1) {
			messages.splice(index, 1);
		}

		setMessages((prevState) => {
			return [
				{
					contact: activeChatUser,
					lastMessage: {
						sender: { name: 'JR Smith', id: 4, email: 'jr123@gmail.com' },
						time: '10: 24 AM',
						text: 'Lorem ipsum dolor imat'
					},
					isGroup: false,
					unread: 0,
				},
				...prevState
			]
		})

	}, [ activeChatUser ])

	const contactName = (contacts: User[]) => {
		return (
			<p>
				{ contacts.length === 0
					? contacts[0].name
					: contacts.map((contact, index) => `${contact.name.split(' ')[0]} ${index !== contacts.length-1 ? ', ' : ''}`)
				}
			</p>
		)
	} 

	return (
		<ul>
			{
				messages.map((message, index) => (
					<div className="message-item" key={ index }>
						<div className="mr-2 mt-1">
							<Avatar/>
						</div>
						<div className="message-item-metadata">
							<div className="message-item-time">{ message.lastMessage.time }</div>
							<div className="message-item-contact">
								{ message.contact.name }
							</div>
							<div className="message-item-chat">
								<p className={`message-item-text ${message.unread === 0 && 'read'}`}>
								{ message.lastMessage.sender.id === authUserId 
									? 'You: '
									: `${message.lastMessage.sender.name.split(' ')[0]}: `
								}
								{ message.lastMessage.text }
								</p>
								{
									message.unread > 0 &&
									<span className="message-item-unread-count">{ message.unread }</span>
								}
							</div>
						</div>
					</div>
				))
			}
		</ul>
	)
}

type Props = {
	user: User;
}

const RecentChat = (props: Props): JSX.Element => {
	return (
		<div className="message-container">
			<div className="search-wrapper">
				<div className="message-search">
					<i className="ri-search-2-line"></i>
					<input className="custom" type="text" placeholder="Search messages.." />
				</div>
			</div>
			<ContactsMessage />
		</div>
	)
}

export default RecentChat;