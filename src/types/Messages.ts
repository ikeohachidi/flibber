import User from './User';

interface Message {
	messages: string[];
	unread: number;
	user: User;
}

export default Message;