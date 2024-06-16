import { createSlice } from '@reduxjs/toolkit';

const menuBurgerSlice = createSlice({
	name : 'menuBurger',
	initialState : true,
	reducers : {
		toggleMenu(state, action) {
			return action.payload;
		},
	},
});

export const {toggleMenu} = menuBurgerSlice.actions;
export default menuBurgerSlice.reducer;
