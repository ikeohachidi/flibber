import './Chat.css';
import MessageInput from './MessageInput/MessageInput';
import Avatar from 'components/Avatar/Avatar';
import ChatDetails from './ChatDetails/ChatDetails';

import { ChatType, Message } from 'types/Message';
import User, { UserSession } from 'types/User';
import { useRef } from 'react';


/**
 * checks if a single user has sent consecutive messages without another
 * person sending a message
 * @param Message message object
 * @returns boolean
 */
const isMessageInAStreak = (messageIndex: number, messages: Message[]) => {
	if (messages.length === 0 || messageIndex === 0) return false;

	const { sender: presentSender } = messages[messageIndex];
	const { sender: prevSender }  = messages[messageIndex - 1];

	return presentSender.id === prevSender.id;
} 

type Props = {
	user: UserSession;
}

const Chat = (props: Props): JSX.Element => {
	const credentials: User = {
		id: 3,
		name: 'Ikeoha Chidi',
		email: 'ikeohachidi@gmail.com'
	};

	const isSignedInUserSender = (sender: User) => sender.id === credentials.id;

	const messages: Message[] = [
		{
			sender: {
				id: 3,
				email: 'ikeohachidi@gmail.com',
				name: 'Ikeoha Chidi'
			},
			chat: {
				type: ChatType.TEXT,
				value: 'X gon give it to you'
			}
		},
		{
			sender: {
				id: 3,
				email: 'ikeohachidi@gmail.com',
				name: 'Ikeoha Chidi'
			},
			chat: {
				type: ChatType.TEXT,
				value: 'He\'s gone give it too you'
			}
		},
		{
			sender: {
				id: 2,
				email: 'chatteta@boommain.com',
				name: 'Chatetta'
			},
			chat: {
				type: ChatType.TEXT,
				value: 'You wanna fight me? fight these tears'
			}
		},
	];

	const chatDetailsEl = useRef<HTMLDivElement>(null);

	const onCloseClick = () => {
		chatDetailsEl.current?.classList.toggle('hide');
	}

	return (
		<section className="chat-container">
			<div className="chat-details hide" ref={ chatDetailsEl }>
				<ChatDetails onCloseClick={ onCloseClick }/>
			</div>
			<div className="chat-banner">
				<span> 🍦 Chat App</span>
				<i className="ri-more-fill" onClick={ onCloseClick }></i>
			</div>
			{
				messages.map((message, index) => (
					<div 
						className={ `chat ${isSignedInUserSender(message.sender) ? 'sending' : 'receiving'}` } 
						key={ index }
					>
						<div className="w-1/12">
							{ isMessageInAStreak(index, messages) === false 
								?  <Avatar dimension={ 30 }/>
								: <span></span> 
							}
						</div>
						<div className="w-11/12 mx-3">
							{ message.chat.type === ChatType.TEXT &&
								<p className="text-bubble">{ message.chat.value }</p>
							}
						</div>
					</div>
				))	
			}
			<div className="message-input">
				<MessageInput />
			</div>
		</section>
	)
}

export default Chat;