import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

import { signIn } from 'services/authentication';
import RoutePath from 'routes';

const Login = () => {
	const navigation = useNavigate();

	const email = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);

	const loginUserAccount = () => {
		signIn({ 
			email: email.current?.value as string,
			password: password.current?.value as string
		})
		.then(({ error }) => {
			if (error) {
				// TODO: handle error
				console.log(error);
				return;
			}
			navigation(RoutePath.APP)
		})
	}

	return (
		<div className="auth-wrapper h-screen flex flex-col items-center justify-center">
			<div className="form-wrapper w-4/12 p-8 rounded-md">
				<div className="input-block">
					<label>Email</label>
					<input type="email" placeholder="John" ref={ email }/>
				</div>
				<div className="input-block col-span-2">
					<label>Password</label>
					<input type="password" ref={ password }/>
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