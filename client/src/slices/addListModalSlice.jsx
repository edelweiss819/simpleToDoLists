import { createSlice } from '@reduxjs/toolkit';


const addListModal = createSlice({
	name : 'addListModal',
	initialState : false,
	reducers : {
		setOpenModal(state, action) {
			console.log('Clicked!');
			return action.payload;
		},
	},
});

export const {setOpenModal} = addListModal.actions;
export default addListModal.reducer;