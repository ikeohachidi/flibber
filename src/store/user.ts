import { createSlice } from '@reduxjs/toolkit';
import { signInService } from 'services/authentication';

import User from "types/User";

type Action = { payload: User | null };

type UserState = {
	user: User | null;
	status: 'pending' | 'fulfilled'
}

const initialState: UserState  = {
	status: 'fulfilled',
	user: null 
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state: UserState, action: Action) {
			state.user = action.payload;
		},
		removeUser(state: UserState) {
			state.user = null 
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(signInService.pending, (state, action) => {
				state.status = 'pending';
			})
			.addCase(signInService.fulfilled, (state, action) => {
				state.user = action.payload as User;
				state.status = 'fulfilled';
			})
	}
})



export const { setUser, removeUser } = userSlice.actions;
export { UserState };
export default userSlice.reducer;