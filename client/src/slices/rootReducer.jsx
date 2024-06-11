import { combineReducers } from '@reduxjs/toolkit';
import selectedToDoListReducer from './selectedToDoListSlice';
import addListModalReducer from './addListModalSlice.jsx';


const rootReducer = combineReducers({
	selectedToDoList : selectedToDoListReducer,
	addListModal : addListModalReducer,
});

export default rootReducer;