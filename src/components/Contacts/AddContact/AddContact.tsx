import { useRef } from 'react';
import { authentictedUser } from 'services/authentication';

const AddContact = (): JSX.Element => {
	const email = useRef<HTMLInputElement>(null);

	return (
		<div className="form-wrapper w-4/12 p-8 rounded-md">
			<div className="input-block">
				<label>Email</label>
				<input type="email" placeholder="John" ref={ email }/>
			</div>

			<div className="col-span-2 flex justify-end">
				<button>Add User</button>
			</div>
		</div>
	)
}

export default AddContact;