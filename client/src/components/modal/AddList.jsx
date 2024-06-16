import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import styles from './AddList.module.css';
import { useDispatch } from 'react-redux';
import { setOpenModal } from '../../store/slices/addListModalSlice.jsx';
import {
	showId,
} from '../../store/slices/selectedToDoListSlice.jsx';
import DeleteButton from '../ui/DeleteButton.jsx';
import { ipp } from '../../../ip.js';

function AddList({onClick}) {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();
	const [isEdited, setIsEdited] = useState(true);
	const [editedTitle, setEditedTitle] = useState('');
	const inputRef = useRef(null);
	
	const addToDoListReq = async ({title, id}) => {
		await axios.post(`http://${ipp}/api/postToDoList`, {title, id});
	};
	
	const addToDoList = useMutation({
		mutationFn : addToDoListReq,
		onSuccess : (data, {title, id}, context) => {
			dispatch(showId(id));
			queryClient.invalidateQueries(['toDoListsArr']);
		},
		onError : (error) => {
			console.log('Ошибка!', error);
		},
	});
	
	const handleEditedText = (event) => {
		setEditedTitle(event.target.value);
	};
	
	const handleClickAddButton = async (event) => {
		const id = uuidv4(); // Генерируем новый айдишник
		setIsEdited(false);
		addToDoList.mutate({title : editedTitle, id}); // Передаем айдишник в запрос
		dispatch(setOpenModal(false));
	};
	
	const handleCloseButtonClick = (event) => {
		dispatch(setOpenModal(false));
	};
	
	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			handleClickAddButton();
		}
	};
	
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);
	
	return (
		<div className={styles.ModalBackdrop}>
			<div className={styles.AddTaskModal}>
				<DeleteButton className={styles.ModalDeleteButton}
							  onClick={handleCloseButtonClick}/>
				<span className={styles.AddTaskModalTitle}>Введите название листа</span>
				<input
					ref={inputRef}
					className={styles.AddTaskModalInput}
					type="text"
					value={editedTitle}
					placeholder={'Введите названия листа'}
					onChange={handleEditedText}
					onKeyPress={handleKeyPress}
				/>
				<div className={styles.AddTaskModalAddButton}
					 onClick={handleClickAddButton}>
					Add
				</div>
			</div>
		</div>
	);
}

export default AddList;
