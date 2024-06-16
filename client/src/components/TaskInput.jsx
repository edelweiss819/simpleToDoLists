import React, { useState } from 'react';
import styles from './TaskInput.module.css';
import { v4 as uuidv4 } from 'uuid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ipp } from '../../ip.js'; // Убедитесь, что путь к ip.js правильный
import { useForm } from 'react-hook-form';

function TaskInput(props) {
	const [taskContent, setTaskContent] = useState('');
	const queryClient = useQueryClient();
	const {register, handleSubmit, reset} = useForm();
	
	const createTask = async (newTask) => {
		try {
			await axios.post(`http://${ipp}/api/todolists/${props.toDoListId}`, newTask);
		} catch (error) {
			console.error('Ошибка при отправке задачи:', error);
		}
	};
	
	const mutation = useMutation({
		mutationFn : createTask,
		onSuccess : (data, variables) => {
			const newTask = variables;
			queryClient.invalidateQueries({queryKey : ['toDoListContent']});
		},
		onError : (error) => {
			console.error('Ошибка при мутации:', error);
		},
	});
	
	const onSubmit = async (data) => {
		const newTask = {
			id : uuidv4(),
			ToDoContent : data.taskContent,
			status : 'in progress',
		};
		await mutation.mutateAsync(newTask); // используем mutateAsync для обработки ошибок
		reset(); // сбрасываем форму после успешной отправки
		setTaskContent('');
	};
	
	
	const handleButtonClick = () => {
		handleSubmit(onSubmit)();
	};
	
	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			// event.preventDefault(); // предотвращаем стандартное действие браузера
			handleSubmit(onSubmit)();
		}
	};
	
	return (
		<div className={styles.TaskInputWrapper}>
			<input
				className={styles.TaskInput}
				{...register('taskContent', {required : true})}
				value={taskContent}
				onChange={(e) => setTaskContent(e.target.value)}
				placeholder={'Введите задачу...'}
				onKeyPress={handleKeyPress}
				autoFocus
			/>
			<div className={styles.TaskInputButton} onClick={handleButtonClick}>
				Add
			</div>
		</div>
	);
}

export default TaskInput;
