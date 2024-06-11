import React, { useState } from 'react';
import styles from './TaskInput.module.css';
import AddButton from './ui/AddButton.jsx';
import { v4 as uuidv4 } from 'uuid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';


function TaskInput(props) {
	
	const [taskContent, setTaskContent] = useState('');
	const queryClient = useQueryClient();
	
	const newTask = {
		id : uuidv4(),
		ToDoContent : taskContent,
		status : 'in progress',
		
	};
	
	
	const createTask = async (newTask) => {
		await axios.post(`http://localhost:3000/api/todolists/${props.toDoListId}`, newTask);
	};
	
	
	const mutation = useMutation({
		mutationFn : createTask,
		onSuccess : (data, variables) => {
			const newTask = variables;
			// console.log('Данные отправлены!', {newTask});
			queryClient.invalidateQueries({queryKey : ['toDoListContent']});
			
		},
		onError : (error) => {
			console.log('Ошибка!', error);
		},
	});
	
	const handleButtonClick = (event) => {
		// console.log('Click!');
		mutation.mutate(newTask);
		setTaskContent('');
	};
	
	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			handleButtonClick();
		}
	};
	return (
		<div className={styles.TaskInputWrapper}>
			<input
				className={styles.TaskInput}
				value={taskContent}
				onChange={(e) => setTaskContent(e.target.value)}
				placeholder={'Введите задачу...'}
				onKeyPress={handleKeyPress}
				autoFocus
			/>
			<AddButton className={styles.TaskInputButton}
					   onClick={handleButtonClick}/>
		</div>
	);
}

export default TaskInput;

