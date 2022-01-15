import { useState, useEffect } from 'react';

import { authentictedUser } from 'supabase/authentication';
import { getUser } from 'supabase/user';

import User, { UserSession } from 'types/User';

export const useActiveUser = (callback?: (activeuser: UserSession, userMetaData: User) => void) => {
	const [ activeUserMetadata, setActiveUserMetadata ] = useState<User>()
	
	useEffect(() => {
		const activeUser = authentictedUser() as UserSession;

		getUser({ email: activeUser.email }, 'email')
			.then(({ data, error }) => {
				if (error) return;
				if (callback) callback(activeUser, data!);
				setActiveUserMetadata(data!)
			})
	}, [])

	return activeUserMetadata;
}