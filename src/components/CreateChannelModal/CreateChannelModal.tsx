import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import './CreateChannelModal.css';
import { Scope } from 'types/Channel';
import { createChannelService } from 'services/channel';
import User from 'types/User';

type Props = {
	onClose: (state: boolean) => void;
	authUser: User;
}

const CreateChannel = ({ onClose, authUser }: Props) => {
	const dispatch = useDispatch();
	const [name, setName] = useState<string>('');
	const [scope, setScope] = useState<Scope>(Scope.PRIVATE);

	const createChannel = () => {
		dispatch(createChannelService({
			channel: {
				name,
				scope
			},
			member: {
				is_admin: true,
				user_id: authUser.id
			}
		}))
	}

	return (
		<div className="create-channel-wrapper">
			<div className="create-channel-form">
				<div className="input-block">
					<label htmlFor="channel-name" className="block mb-2">Channel name</label>
					<input 
						type="text"
						placeholder="For the boys!!!"
						value={ name }
						onChange={ (e) => setName(e.target.value) }
					/>
				</div>

				<label htmlFor="channel-privacy" className="block mb-2 mt-6">Channel Privacy</label>
				<p>
					<input 
						type="radio" 
						id={ `scope-${Scope.PRIVATE}` }
						value={ Scope.PRIVATE }
						onChange={ (e) => setScope(e.target.value as Scope) }
					/>
					<label htmlFor={ `scope-${Scope.PRIVATE}` }>Private</label>
					<input 
						type="radio" 
						name={ `scope-${Scope.PRIVATE}` }
						value={ Scope.PUBLIC }
						onChange={ (e) => setScope(e.target.value as Scope) }
					/>
					<label htmlFor={ `scope-${Scope.PUBLIC}` }>Public</label>
				</p>

				<div className="flex justify-end mt-6">
					<button onClick={ () => onClose(false) } className="no-outline">Cancel</button>
					<button onClick={ createChannel }>Create Channel</button>
				</div>
			</div>
		</div>
	)
}

export default CreateChannel;