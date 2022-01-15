import { createSlice } from '@reduxjs/toolkit';

import { signInService } from 'services/authentication';

import User from "types/User";

type Action = { payload: User | null };

type State = {
	user: Partial<User> | null;
	status: 'pending' | 'fulfilled'
}

const initialState: State  = {
	status: 'fulfilled',
	user: null 
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state: State, action: Action) {
			state.user = action.payload;
		},
		removeUser(state: State) {
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

export default userSlice.reducer;