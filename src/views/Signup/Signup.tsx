import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

import { activeUser, signUp } from 'services/authentication';
import RoutePath from 'routes';

const Signup = () => {
	const navigation = useNavigate();
	const name = useRef<HTMLInputElement>(null);
	const email = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	
	const createUserAccount = () => {
		signUp({
			email: email.current?.value,
			password: password.current?.value,
			name: name.current?.value
		})
		.then(({ error }) => {
			if (error) {
				// TODO: handle error
				console.log(error)
				return;
			}
			navigation(RoutePath.APP)
		})
	}

	useEffect(() => {
		if (activeUser()) {
			navigation(RoutePath.APP);
		}
	})

	return (
		<div className="auth-wrapper h-screen flex flex-col items-center justify-center">
			<div className="form-wrapper grid grid-cols-2 gap-4 w-4/12 p-8 rounded-md">
				<div className="input-block">
					<label>Name</label>
					<input type="text" placeholder="John" ref={ name } />
				</div>
				<div className="input-block">
					<label>Email</label>
					<input type="email" placeholder="johnwoo@faceoff.movie" ref={ email } />
				</div>
				<div className="input-block col-span-2">
					<label>Password</label>
					<input type="password" ref={ password }/>
				</div>

				<div className="col-span-2 flex justify-end">
					<button onClick={ createUserAccount }>Signup</button>
				</div>
			</div>
			<p className="text-white mt-4">Already have an account? <Link className="text-indigo-700 underline" to={ RoutePath.LOGIN }>Login</Link></p>
		</div>
	)
}

export default Signup;