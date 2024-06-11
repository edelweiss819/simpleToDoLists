import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchInitialState = createAsyncThunk(
	'selectedToDoListId/fetchInitialState',
	async () => {
		const response = await axios.get('http://localhost:3000/api/getFirstToDoListId');
		return response.data.firstToDoListId;
	},
);

const selectedToDoListSlice = createSlice(
	{
		name : 'selectedToDoListId',
		initialState : '', // Всегда будет пустой строкой.
		reducers : {
			showId(state, action) {
				// console.log('Предыдущее состояние:', state);
				// console.log('Обновленное состояние:', action.payload);
				return action.payload;
			},
		}, extraReducers : builder => {
			builder.addCase(fetchInitialState.fulfilled, (state, action) => {
				return action.payload;
			});
		},
	},
);

export const {showId} = selectedToDoListSlice.actions;
export default selectedToDoListSlice.reducer;
