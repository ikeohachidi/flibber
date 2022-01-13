import './Login.css';

const Login = () => {
	return (
		<div className="auth-wrapper h-screen flex items-center justify-center">
			<div className="form-wrapper w-4/12 p-8 rounded-md">
				<div className="input-block">
					<label>Email</label>
					<input type="email" placeholder="John"/>
				</div>
				<div className="input-block col-span-2">
					<label>Password</label>
					<input type="password" placeholder=""/>
				</div>

				<div className="col-span-2 flex justify-end">
					<button>Login</button>
				</div>
			</div>
		</div>
	)
}

export default Login;