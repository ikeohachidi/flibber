import React from 'react';
import './ChatDetails.css';

type Props = {
	onCloseClick: () => void;
}

const ChatDetails = (props: Props): JSX.Element => {
	return (
		<section className="chat-details-container">
			<div className="flex items-center justify-between p-5">
				<h1 className="text-2xl">Chat Details</h1>
				<i 
					className="ri-close-circle-line ri-2x" 
					onClick={ props.onCloseClick }>
				</i>
			</div>
		</section>
	)
}

export default ChatDetails; 