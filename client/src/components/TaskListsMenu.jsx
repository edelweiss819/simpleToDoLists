import React, { useState } from 'react';
import styles from './TaskListsMenu.module.css';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { showId } from '../slices/selectedToDoListSlice.jsx';
import { setOpenModal } from '../slices/addListModalSlice.jsx';
import TaskListMenuTitle from './TaskListMenuTitle.jsx';
import AddList from './modal/AddList.jsx';


function TaskListsMenu(props) {
	const dispatch = useDispatch();
	const openModal = useSelector(state => state.addListModal);
	
	
	const fetchToDoLists = async () => {
		const res = await axios.get('http://localhost:3000/api/getToDoListsTitlesWithIdArr');
		// console.log(res.data);
		return res.data;
		
		
	};
	
	
	const {data, isError, isLoading, isSuccess} = useQuery({
		queryKey : ['toDoListsArr'],
		queryFn : fetchToDoLists,
		retry : 1,
	});
	
	if (isLoading) {
		return <div>Попытка загрузки данных.</div>;
	}
	
	if (isError) {
		return <div>Ошибка при загрузке данных.</div>; // Возвращаем JSX в случае ошибки
	}
	
	const handleClickOnPlus = (event) => {
		openModal ? dispatch(setOpenModal(false)) :
			dispatch(setOpenModal(true));
	};
	
	
	const handleTaskTitleClick = (id) => {
		console.log('Clicked id:', id);
		dispatch(showId(id));
	};
	
	
	return (
		<div className={styles.TaskListsMenu}>
			<div className={styles.TaskListsMenuHeader}>Листы</div>
			
			<div className={styles.TaskListsWrapper}>
				{Object.entries(data).map(([listName, listInfo]) => (
					<TaskListMenuTitle
						key={listInfo.id}
						title={listName}
						onClick={() => handleTaskTitleClick(listInfo.id)}
					/>
				))}
				<div className={styles.AddTaskList}
					 onClick={handleClickOnPlus}>+
				</div>
			
			</div>
		</div>
	);
}

export default TaskListsMenu;