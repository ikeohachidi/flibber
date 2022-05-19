import React, { useEffect, useState } from 'react';
import CreateChannelModal from 'components/CreateChannelModal/CreateChannelModal';
import './Channels.css'
import User from 'types/User';
import { useDispatch } from 'react-redux';
import { getUserChannelsService } from 'services/channel';

interface Channel {
	icon: string;
	text: string;
	unread?: number;
}

type Props = {
	authUser: User
}

const Channels = (props: Props): JSX.Element => {
	const dispatch = useDispatch();
	const [ showCreateChannelModal, setShowCreateChannelModal ] = useState(false);

	useEffect(() => {
		if (props.authUser) {
			dispatch(getUserChannelsService(props.authUser.id))
		}
	}, [ props.authUser ])
	
	const channels: Channel[] = [
		{ icon: '😁', text: 'Design', unread: 3 },
		{ icon: '🇳🇬', text: 'Customer Supports', unread: 5 },
		{ icon: '🎯', text: 'Sales & Marketing', unread: 18 },
		{ icon: '🌎', text: 'Tech Support', unread: 18 }
	];

	const activeItem = 'Design';

	const channelsList = channels.map((channel, index) => (
		<li className={`list-item ${ activeItem === channel.text && 'active' }`} key={ index }>
			<span className="mr-3">{ channel.icon }</span>
			<span>{ channel.text }</span>
			<span className="rounded-xl ml-auto text-xs bg-gray-800 py-1 px-2">{ channel.unread }</span>
		</li>
	))

	return (
		<div>
			{
				showCreateChannelModal &&
				<CreateChannelModal 
					authUser={ props.authUser }
					onClose={ setShowCreateChannelModal }
				/>
			}

			<p className="flex text-gray-500 px-4 mb-3">
				<span className="flex items-center">
					<i className="ri-arrow-down-s-line"></i>
					<span className="inline-block ml-3 text-xs">
						CHANNELS
					</span>
				</span>
				<span 
					className="ml-auto cursor-pointer" 
					onClick={ () => setShowCreateChannelModal(true) }
				>
					<i className="ri-add-line"></i>
				</span>
			</p>
			<ul>
				{ channelsList }
			</ul>
		</div>
	)
}

export default Channels;