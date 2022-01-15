import { useRef } from 'react';

import { sendContactRequest } from 'supabase/contact';

import User from 'types/User';

type Props = {
	user: User;
}

const AddContact = (props: Props): JSX.Element => {
	const email = useRef<HTMLInputElement>(null);

	const addUser = () => {
		if (email.current) {
			// TODO: add loader indicator and success/error alert
			// TODO: shouldn't be using the function from the supabase folder directly
			if (props.user) sendContactRequest(props.user.id, email.current?.value)
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