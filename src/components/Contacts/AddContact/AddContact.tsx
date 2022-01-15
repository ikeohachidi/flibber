import { useRef } from 'react';
import { useSelector } from 'react-redux';

import { sendContactRequest } from 'supabase/contact';

import { UserState } from 'store/user';
import User from 'types/User';

const AddContact = (): JSX.Element => {
	const email = useRef<HTMLInputElement>(null);
	const selector = useSelector<{ user: UserState }, User>(state => state.user.user as User);

	const addUser = () => {
		if (email.current) {
			// TODO: add loader indicator and success/error alert
			sendContactRequest(selector.id, email.current?.value)
		}
	}

	return (
		<div className="form-wrapper w-4/12 p-8 rounded-md">
			<div className="input-block">
				<label>Email</label>
				<input type="email" placeholder="John" ref={ email }/>
			</div>

			<div className="col-span-2 flex justify-end">
				<button onClick={ addUser }>Add User</button>
			</div>
		</div>
	)
}

export default AddContact;