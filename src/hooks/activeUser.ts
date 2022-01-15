import { useState, useEffect } from 'react';

import { authentictedUser } from 'supabase/authentication';
import { getUser } from 'supabase/user';

import User, { UserSession } from 'types/User';

export const useActiveUser = (callback?: (activeuser: UserSession) => void) => {
	const [ activeUserMetadata, setActiveUserMetadata ] = useState<User>()
	
	useEffect(() => {
		const activeUser = authentictedUser() as UserSession;

		if (callback) callback(activeUser);

		getUser({ email: activeUser.email }, 'email')
			.then(({ data, error }) => {
				if (error) return;
				setActiveUserMetadata(data!)
			})
	}, [ activeUserMetadata ])

	return activeUserMetadata;
}