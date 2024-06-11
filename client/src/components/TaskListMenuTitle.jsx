import React from 'react';
import styles from './TaskListMenuTitle.module.css';

function TaskListMenuTitle({title, onClick}) {
	return (
		<div className={styles.TaskListTitle} onClick={onClick}>
			{title}
		</div>
	);
}

export default TaskListMenuTitle;