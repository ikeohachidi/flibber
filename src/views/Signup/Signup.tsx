import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

import { authentictedUser, signUp } from 'supabase/authentication';
import RoutePath from 'routes';

const Signup = () => {
	const navigation = useNavigate();
	const name = useRef<HTMLInputElement>(null);
	const email = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	const [ passwordType, setPasswordType ] = useState<'text' | 'password'>('password');
	
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

	const togglePasswordDisplay = () => {
		setPasswordType(passwordType === 'text' ? 'password' : 'text');
	}

	useEffect(() => {
		if (authentictedUser()) {
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
					<div className="password-box flex items-center">
						<input className="grow" type={ passwordType } ref={ password }/>
						<i className={
								`${passwordType === 'password' ? 'ri-eye-line' : 'ri-eye-off-line' }
								text-lg ml-5
								text-white
								cursor-pointer`
							}
							onClick={ togglePasswordDisplay }
						></i>
					</div>
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