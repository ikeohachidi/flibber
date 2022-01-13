import './Signup.css';

const Signup = () => {
	return (
		<div className="auth-wrapper h-screen flex items-center justify-center">
			<div className="form-wrapper grid grid-cols-2 gap-4 w-4/12 p-8 rounded-md">
				<div className="input-block">
					<label>First Name</label>
					<input type="text" placeholder="John"/>
				</div>
				<div className="input-block">
					<label>Last Name</label>
					<input type="text" placeholder="Woo"/>
				</div>
				<div className="input-block col-span-2">
					<label>Email</label>
					<input type="email" placeholder="johnwoo@faceoff.movie"/>
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

export default Signup;