import React, { useState } from 'react';
import styles from './TaskListHeader.module.css';
import axios from 'axios';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import RemoveList from './RemoveList.jsx';
import { ipp } from '../../ip.js';


function TaskListHeader({toDoListId}) {
	
	const queryClient = useQueryClient();
	const [isEditing, setIsEditing] = useState(false);
	const [editedText, setEditedText] = useState(toDoListId.title || '');
	
	
	const changeToDoListTitleReq = async (title) => {
		await axios.put(`http://${ipp}/api/ChangeToDoListTitleById/${toDoListId}`, {title});
	};
	
	
	const changeToDoListTitle = useMutation({
			mutationFn : changeToDoListTitleReq,
			onSuccess : (data, variables) => {
				console.log('Название листа изменено!', variables);
				queryClient.invalidateQueries({queryKey : ['toDoListTitle']});
				queryClient.invalidateQueries({queryKey : ['toDoListsArr']});
			},
			onError : (error) => {
				console.log('Ошибка!', error);
			},
		},
	);
	
	const fetchListHeader = async (id) => {
		const response = await axios.get(`http://${ipp}/api/toDoListsById/${id}`);
		return response.data.title;
	};
	
	const {data, error, isLoading} = useQuery({
		queryKey : ['toDoListTitle',
					toDoListId],
		queryFn : () => fetchListHeader(toDoListId),
		retry : 1,
		// staleTime : 0,
	});
	
	if (isLoading) return <div>Title is loading..</div>;
	if (error) return <div>Error: {error.message}</div>;
	
	
	const handleTitleTextClick = (event) => {
		setEditedText(data);
		setIsEditing(true);
	};
	
	const handeTitleTextChange = (event) => {
		setEditedText(event.target.value);
	};
	
	const handleSaveChangedText = (event) => {
		setIsEditing(false);
		changeToDoListTitle.mutate(editedText);
		setEditedText('');
	};
	
	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			handleSaveChangedText();
		}
	};
	
	return (
		<div className={styles.TaskListWrapper}>
			{(isEditing) ? (<input type="text"
								   className={styles.TaskListHeaderTitle}
								   value={editedText}
								   onChange={handeTitleTextChange}
								   onBlur={handleSaveChangedText}
								   onKeyPress={handleKeyPress}
								   autoFocus
				
				/>) :
				(<div className={styles.TaskListHeaderTitle}
					  onClick={handleTitleTextClick}>
					{( !data) ? 'Новый лист' : data}
				</div>)}
			<RemoveList className={styles.TaskListHeaderAction}
						toDoListId={toDoListId}/>
		</div>
	);
}

export default TaskListHeader;
