import supabase from "./supabase";

import User from "types/User";

const createUser = async (user: Partial<User>) => {
	const { data, error } = await supabase
		.from('user')
		.insert([ user ])

	return { data, error }
}

export {
	createUser
}