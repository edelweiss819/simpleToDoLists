import React, { useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './App.css';
import TaskListsMenu from './components/TaskListsMenu.jsx';
import TaskList from './components/TaskList.jsx';


function App() {
	
	
	return (
		
		<div className="App">
			<TaskListsMenu/>
			<TaskList/>
			<ReactQueryDevtools initialIsOpen={false}/>
		
		</div>
	
	);
}

export default App;
