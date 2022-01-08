import AvatarGroup from 'components/Avatar/AvatarGroup';
import User from 'types/User';
import './Messages.css';

const ContactsMessage = (): JSX.Element => {
	const credentials = {
		id: 3,
	}
	const messages = [
		{
			contacts: [
				{ name: 'Hocaha Enyi', id: 3, email: 'hocaha123@gmail.com' },
				{ name: 'Emmanuel Chukwujindu', id: 2, email: 'emma123@gmail.com' },
			],
			lastMessage: {
				sender: { name: 'Ikeoha Chidi', id: 3, email: 'ikeoha123@gmail.com' },
				time: '10: 24 AM',
				text: 'Lorem ipsum dolor imat'
			},
			unread: 4
		},
		{
			contacts: [
				{ name: 'JR Smith', id: 4, email: 'jr123@gmail.com' },
			],
			lastMessage: {
				sender: { name: 'JR Smith', id: 4, email: 'jr123@gmail.com' },
				time: '10: 24 AM',
				text: 'Lorem ipsum dolor imat'
			},
			unread: 0,
		}
	]
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
						<div>
							<AvatarGroup users={ message.contacts }/>
						</div>
						<div className="message-item-metadata">
							<div className="message-item-time">{ message.lastMessage.time }</div>
							<div className="message-item-contact">
								{ contactName(message.contacts) }
							</div>
							<div className="message-item-chat">
								<p className={`message-item-text ${message.unread === 0 && 'read'}`}>
								{ message.lastMessage.sender.id === credentials.id
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

const Messages = (): JSX.Element => {
	return (
		<div className="message-container">
			<div className="search-wrapper">
				<div className="message-search">
					<i className="ri-search-2-line"></i>
					<input type="text" placeholder="Search messages.." />
				</div>
			</div>
			<ContactsMessage />
		</div>
	)
}

export default Messages;