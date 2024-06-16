import React from 'react';
import Task from './Task.jsx';
import styles from './TaskContainer.module.css';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { ipp } from '../../ip.js';

const fetchTodoListContent = async (id) => {
	const response = await axios.get(`http://${ipp}/api/toDoListsById/${id}`);
	return response.data.content;
};

function TasksContainer(props) {
	const {data, error, isLoading} = useQuery({
		queryKey : ['toDoListContent',
					props.toDoListId],
		queryFn : () => fetchTodoListContent(props.toDoListId),
		retry : 1,
		// staleTime : 0,
	});
	
	if (isLoading) return <div>Content is loading..</div>;
	if (error) return <div>Error: {error.message}</div>;
	if ( !data) return <div>Нет данных.</div>;
	
	const completedTask = data.filter(task => task.status === 'completed');
	const uncompletedTask = data.filter(task => task.status === 'in progress');
	
	return (
		<div>
			<div className={styles.TasksContainerTitle}>Tasks</div>
			
			{uncompletedTask.length === 0 && (
				<div className={styles.CompletedMessage}>Все задачи
					выполнены!</div>
			)}
			
			{uncompletedTask.map((task, index) => (
				<Task key={index} task={task} toDoListId={props.toDoListId}/>
			))}
			
			<div className={styles.TasksContainerTitle}>Completed</div>
			{completedTask.map((task, index) => (
				<Task key={index} task={task} toDoListId={props.toDoListId}/>
			))}
		</div>
	);
}

export default TasksContainer;
