import React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './App.css';
import TaskListsMenu from './components/TaskListsMenu.jsx';
import TaskList from './components/TaskList.jsx';
import MenuBurger from './components/MenuBurger.jsx';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

function App() {
	const menuBurgerStatus = useSelector(state => state.menuBurger);
	const AppLayout = classNames('App', {'ClosedMenu' : !menuBurgerStatus});
	
	return (
		<div className={AppLayout}>
			<MenuBurger/>
			<TaskList/>
			{/*<TaskListsMenu />*/}
			{/*<ReactQueryDevtools initialIsOpen={false} />*/}
		</div>
	);
}

export default App;
