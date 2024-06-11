import React from 'react';
import Task from './Task.jsx';
import styles from './TaskContainer.module.css';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchTodoListContent = async (id) => {
	const response = await axios.get(`http://localhost:3000/api/toDoListsById/${id}`);
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
	
	return (
		<div>
			<div className={styles.TasksContainerTitle}>Tasks</div>
			{data.map((task, index) => (
				<Task key={index} task={task} toDoListId={props.toDoListId}/>
			))}
		</div>
	);
}

export default TasksContainer;
