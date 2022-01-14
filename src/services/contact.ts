import User from "types/User"
import supabase from "./supabase"

const sendContactRequest = async (requester: number, email: string) => {
	const { data, error } = await supabase
		.from<User>('user')
		.select('id')
		.eq('email', email)
		.single()
	
	if (error) return;

	return supabase
		.from('contact_request')
		.insert([
			{ requester, invitee: data?.id }
		])
}

export {
	sendContactRequest
}