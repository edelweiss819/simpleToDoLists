import { combineReducers } from '@reduxjs/toolkit';
import selectedToDoListReducer from './selectedToDoListSlice.jsx';
import addListModalReducer from './addListModalSlice.jsx';
import menuBurgerReducer from './menuBurgerSlice.jsx';


const rootReducer = combineReducers({
	selectedToDoList : selectedToDoListReducer,
	addListModal : addListModalReducer,
	menuBurger : menuBurgerReducer,
	
});

export default rootReducer;