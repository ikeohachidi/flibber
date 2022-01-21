import User from "types/User"
import supabase from "./supabase"

const sendContactRequest = async (requester: number, email: string) => {
	const { data, error } = await supabase
		.from<User>('user')
		.select('id')
		.eq('email', email)
		.single()

	if (error) return error;
	if (data?.id === requester) return;

	return supabase
		.from('contact_request')
		.insert([
			{ requester, requestee: data?.id }
		])
}

const getPendingContactRequest = (userId: number) => {
	return supabase
		.from('contact_request')
		.select(`
			user( * )
		`)
		.eq('requestee', userId)
}

const getAcceptedContactsRequest = (userid: number) => {
	return supabase
		.rpc('get_contacts', { userid })
}

const acceptContactRequest = (userId: number, requester: number) => {
	return supabase
		.rpc('accept_contact_request', { 
			sender: requester, 
			sendee: userId
		})
}

const declineContactRequest = (userId: number, requester: number) => {
	return supabase
		.from('contact_request')
		.delete()
		.match({ requester, requestee: userId })
}

export {
	sendContactRequest,
	getPendingContactRequest,
	getAcceptedContactsRequest,
	acceptContactRequest,
	declineContactRequest
}