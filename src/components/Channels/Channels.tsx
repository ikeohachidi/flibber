import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Channels.css'

import CreateChannelModal from 'components/CreateChannelModal/CreateChannelModal';
import Spinner from 'components/Spinner/Spinner';

import User from 'types/User';
import { Channel } from 'types/Channel';
import { getUserChannelsService } from 'services/channel';
import { AppState } from 'store';

type Props = {
	authUser: User
}

const Channels = (props: Props): JSX.Element => {
	const dispatch = useDispatch();
	const [ showCreateChannelModal, setShowCreateChannelModal ] = useState(false);
	const channels = useSelector<AppState, Channel[]>(state => {
		return state.channel.channels.map(channel => channel.metadata);
	});
	const isLoadingChannels = useSelector<AppState, boolean>(state => state.channel.isLoadingChannels);

	useEffect(() => {
		if (props.authUser) {
			dispatch(getUserChannelsService(props.authUser.id))
		}
	}, [ props.authUser ])

	const activeItem = 'Design';

	const channelsList = channels.map((channel, index) => (
		<li className={`list-item`} key={ index }>
			{/* <span className="mr-3">{ channel.icon }</span> */}
			<span>{ channel.name }</span>
			{/* <span className="rounded-xl ml-auto text-xs bg-gray-800 py-1 px-2">{ channel.unread }</span> */}
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
					{
						isLoadingChannels
						? <Spinner size={"15px"}/>
						: <i className="ri-arrow-down-s-line"></i>
					}
					<span className="flex ml-3 text-xs">
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