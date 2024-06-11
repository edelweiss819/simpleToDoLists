import React, { useEffect } from 'react';
import TaskListHeader from './TaskListHeader.jsx';
import TasksContainer from './TasksContainer.jsx';
import TaskInput from './TaskInput.jsx';
import styles from './TaskList.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInitialState } from '../slices/selectedToDoListSlice.jsx';
import AddList from './modal/AddList.jsx';


function TaskList(props) {
	const selectedToDo = useSelector(state => state.selectedToDoList);
	const openModal = useSelector(state => state.addListModal);
	const dispatch = useDispatch();
	
	useEffect(() => {
		dispatch(fetchInitialState());
	}, [dispatch]);
	
	
	return (
		<div className={styles.TaskList}>
			<TaskListHeader toDoListId={selectedToDo}/>
			<TasksContainer toDoListId={selectedToDo}/>
			<TaskInput toDoListId={selectedToDo}/>
			<div>{openModal ?
				<AddList/> : null}
			</div>
		</div>
	);
}

export default TaskList;