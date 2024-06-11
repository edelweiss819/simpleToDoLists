import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import styles from './AddList.module.css';
import { useDispatch } from 'react-redux';
import Cross from '../../assets/Cross.jsx';
import DeleteButton from '../ui/DeleteButton.jsx';
import { setOpenModal } from '../../slices/addListModalSlice.jsx';

function AddList({onClick}) {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();
	const [isEdited, setIsEdited] = useState(true);
	const [editedTitle, setEditedTitle] = useState('');
	
	const addToDoListReq = async (title) => {
		await axios.post('http://localhost:3000/api/postToDoList', {title});
	};
	
	const addToDoList = useMutation({
		mutationFn : addToDoListReq,
		onSuccess : (data, variables, context) => {
			console.log('Лист успешно добавлен!', variables);
			queryClient.invalidateQueries(['toDoListsArr']);
		},
		onError : (error) => {
			console.log('Ошибка!', error);
		},
	});
	
	const handleEditedText = (event) => {
		setEditedTitle(event.target.value);
	};
	
	const handleClickAddButton = (event) => {
		setIsEdited(false);
		addToDoList.mutate(editedTitle);
		dispatch(setOpenModal(false));
	};
	
	const handleCloseButtonClick = (event) => {
		dispatch(setOpenModal(false));
	};
	
	return (
		<div className={styles.ModalBackdrop}>
			<div className={styles.AddTaskModal}>
				<DeleteButton className={styles.ModalDeleteButton}
							  onClick={handleCloseButtonClick}/>
				<span
					className={styles.AddTaskModalTitle}>Введите название листа</span>
				<input className={styles.AddTaskModalInput}
					   type="text"
					   value={editedTitle}
					   placeholder={'Введите названия листа'}
					   onChange={handleEditedText}/>
				<div className={styles.AddTaskModalAddButton}
					 onClick={handleClickAddButton}>Add
				</div>
			</div>
		</div>
	);
}

export default AddList;