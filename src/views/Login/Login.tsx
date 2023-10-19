import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

import { authentictedUser } from 'supabase/authentication';
import RoutePath from 'routes';
import { signInService } from 'services/authentication';
import store from 'store';

const Login = () => {
	const navigation = useNavigate();

	const email = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	const [ passwordType, setPasswordType ] = useState<'text' | 'password'>('password');

	const loginUserAccount = () => {
		store.dispatch(signInService({
			email: email.current?.value as string,
			password: password.current?.value as string
		}))
		.then(() => {
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
			<div className="form-wrapper w-4/12 p-8 rounded-md">
				<div className="input-block">
					<label>Email</label>
					<input type="email" placeholder="John" ref={ email }/>
				</div>
				<div className="input-block col-span-2">
					<label>Password</label>
					<div className="flex items-center">
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
					<button onClick={ loginUserAccount }>Login</button>
				</div>
			</div>
			<p className="text-white mt-4">Don't have an account yet? <Link className="text-indigo-700 underline" to={ RoutePath.SIGNUP }>Signup</Link></p>
		</div>
	)
}

export default Login;