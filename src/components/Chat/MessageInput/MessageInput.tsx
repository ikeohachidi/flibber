import User from 'types/User';
import './MessageInput.css';

const MessageInput = (): JSX.Element => {
	const activeUser: User = {
		id: 22,
		email: 'ikeohachidi@gmail.com',
		name: 'Ikeoha Chidi',
	}

	return (
		<div className="message-input-container">
			<i className="ri-mic-2-line"></i>
			<input className="custom" type="text" placeholder={`Message ${ activeUser.name }`}/>
			<i className="ri-add-line mx-4"></i>
			<i className="ri-send-plane-line"></i>
		</div>
	)
}

export default MessageInput;