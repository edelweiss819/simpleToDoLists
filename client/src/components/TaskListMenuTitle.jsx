import React from 'react';
import styles from './TaskListMenuTitle.module.css';
import { useSelector } from 'react-redux';

function TaskListMenuTitle({title, onClick, id}) {
	const currentTaskListId = useSelector(state => state.selectedToDoList);
	
	
	return (
		(currentTaskListId === id) ?
			(<div className={styles.SelectedListTitle} onClick={onClick}>
				{title}
			</div>) :
			<div className={styles.TaskListTitle} onClick={onClick}>
				{title}
			</div>
	);
	
}

export default TaskListMenuTitle;