import { useState, useEffect } from 'react';

import { authentictedUser } from 'supabase/authentication';
import { getUser } from 'supabase/user';

import User from 'types/User';
import { User as UserSession } from '@supabase/supabase-js';

export const useActiveUser = (callback: (activeuser: UserSession | null, userMetaData: User | null) => void) => {
	const [ activeUserMetadata, setActiveUserMetadata ] = useState<User>()
	
	useEffect(() => {
		const activeUser = authentictedUser() as UserSession;

		if (!activeUser) {
			callback(null, null);
			return;
		} 

		getUser({ email: activeUser.email }, 'email')
			.then(({ data, error }) => {
				if (error) return;
				setActiveUserMetadata(data!)
				if (callback) callback(activeUser, data!);
			})
	}, [])

	return activeUserMetadata;
}