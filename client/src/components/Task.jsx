import React, { useState } from 'react';
import StatusCircle from '../assets/StatusCircle.jsx';
import styles from './Task.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import DeleteButton from './ui/DeleteButton.jsx';

function Task({task, toDoListId, ...props}) {
	const queryClient = useQueryClient();
	const [isEditing, setIsEditing] = useState(false);
	const [editedText, setEditedText] = useState(task.ToDoContent);
	
	const putTaskStatusReq = async (status) => {
		await axios.put(`http://localhost:3000/api/todolists/${toDoListId}/${task.id}`, {status});
	};
	
	const taskStatusToggler = async () => {
		const newStatus = task.status === 'completed' ? 'in progress' :
			'completed';
		await putTaskStatusReq(newStatus);
	};
	
	const changeStatus = useMutation({
		mutationFn : taskStatusToggler,
		onSuccess : () => {
			// console.log('Успешная смена статуса!');
			queryClient.invalidateQueries({queryKey : ['toDoListContent']});
		},
		onError : (error) => {
			console.log('Ошибка!', error);
		},
	});
	
	const deleteTaskReq = async () => {
		await axios.delete(`http://localhost:3000/api/todolists/${toDoListId}/${task.id}`);
	};
	
	const deleteTask = useMutation({
		mutationFn : deleteTaskReq,
		onSuccess : () => {
			// console.log('Задача удалена!');
			queryClient.invalidateQueries({queryKey : ['toDoListContent']});
			queryClient.invalidateQueries({queryKey : ['toDoListTitle']});
		},
		onError : (error) => {
			console.log('Ошибка!', error);
		},
	});
	
	const changeTaskContentReq = async (newContent) => {
		await axios.put(`http://localhost:3000/api/todolists/${toDoListId}/${task.id}`, {newContent});
	};
	
	
	const changeTaskContent = useMutation({
		mutationFn : changeTaskContentReq,
		onSuccess : () => {
			// console.log('Задача изменена!');
			queryClient.invalidateQueries({queryKey : ['toDoListContent']});
		},
		onError : (error) => {
			console.log('Ошибка!', error);
		},
	});
	const handleCircleClick = (event) => {
		event.stopPropagation();
		changeStatus.mutate();
	};
	
	const handleDeleteButtonClick = (event) => {
		event.stopPropagation();
		deleteTask.mutate(task);
	};
	
	const handleTaskTextClick = () => {
		setIsEditing(true);
	};
	
	const handleTextChange = (event) => {
		setEditedText(event.target.value);
	};
	
	const handleEditSave = async () => {
		setIsEditing(false);
		changeTaskContent.mutate(editedText);
	};
	
	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			handleEditSave();
		}
		
	};
	
	return (
		<div className={styles.TaskContainer}>
			<StatusCircle
				className={styles.TaskStatus}
				color={task.status === 'completed' ? '#40A578' : '#D0D5DD'}
				onClick={handleCircleClick}
			/>
			{isEditing ? (
				<input
					type="text"
					className={styles.text}
					value={editedText}
					onChange={handleTextChange}
					onBlur={handleEditSave}
					onKeyPress={handleKeyPress}
					autoFocus
				/>
			) : (
				<div className={styles.TaskText}
					 onClick={handleTaskTextClick}>{task.ToDoContent}</div>
			)}
			<div className={styles.DeleteButton}
				 onClick={handleDeleteButtonClick}><DeleteButton/></div>
		</div>
	);
}

export default Task;
