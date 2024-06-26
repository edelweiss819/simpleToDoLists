import React from 'react';
import styles from './TaskListsMenu.module.css';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { showId } from '../store/slices/selectedToDoListSlice.jsx';
import { setOpenModal } from '../store/slices/addListModalSlice.jsx';
import TaskListMenuTitle from './TaskListMenuTitle.jsx';
import { ipp } from '../../ip.js';


function TaskListsMenu(props) {
	const dispatch = useDispatch();
	const openModal = useSelector(state => state.addListModal);
	
	
	const fetchToDoLists = async () => {
		const res = await axios.get(`http://${ipp}/api/getToDoListsTitlesWithIdArr`);
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
		// console.log('Clicked id:', id);
		dispatch(showId(id));
	};
	
	/*
	 // Альтернативный способ, без CSS
	 // Обработка маленьких экранов
	 // <= 380px - 7 symbols, <= 470px - 9 symbols, >470px - 12 symblos
	 const handleLongTitle = (listInfo) => {
	 let titleLength;
	 if (window.matchMedia('(max-width: 380px)').matches) {
	 titleLength = 7;
	 } else if (window.matchMedia('(max-width: 480px)').matches) {
	 titleLength = 9;
	 } else {
	 titleLength = 12;
	 }
	 
	 
	 if (listInfo.title.length >= titleLength) {
	 return listInfo.title.slice(0, titleLength) + '..';
	 }
	 return listInfo.title;
	 };*/
	
	
	return (
		<div className={styles.TaskListsMenu}>
			<div className={styles.TaskListsMenuHeader}>Листы</div>
			
			<div className={styles.TaskListsWrapper}>
				{data.map((listInfo) => (
					<TaskListMenuTitle
						key={listInfo.id}
						title={listInfo.title}
						id={listInfo.id}
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