import { useState, useEffect } from 'react';

import { authentictedUser } from 'supabase/authentication';
import { getUser } from 'supabase/user';

import User, { UserSession } from 'types/User';

export const useActiveUser = (callback?: (activeuser: UserSession, userMetaData: User | null) => void) => {
	const [ activeUserMetadata, setActiveUserMetadata ] = useState<User>()
	
	useEffect(() => {
		const activeUser = authentictedUser() as UserSession;

		if (callback) callback(activeUser, null);
		if (!activeUser) return; 

		getUser({ email: activeUser.email }, 'email')
			.then(({ data, error }) => {
				if (error) return;
				setActiveUserMetadata(data!)
				if (callback) callback(activeUser, data!);
			})
	}, [ ])

	return activeUserMetadata;
}