import supabase from "./supabase";

import User from "types/User";

const createUser = async (user: Partial<User>) => {
	const { data, error } = await supabase
		.from('user')
		.insert([ user ])

	return { data, error }
}

const getUser = async(user: Partial<User>, column: keyof User) => {
	const { data, error } = await supabase
		.from('user')
		.select('*')
		.eq('email', user[column])
		.single()

	return { data, error }
}

export {
	createUser,
	getUser
}