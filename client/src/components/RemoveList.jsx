import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

function RemoveList({toDoListId}) {
	const queryClient = useQueryClient();
	
	const deleteCurrentListReq = async () => {
		await axios.delete(`http://localhost:3000/api/DeleteToDoListsById/${toDoListId}`);
	};
	
	const deleteCurrentList = useMutation({
		mutationFn : deleteCurrentListReq,
		onSuccess : () => {
			console.log('Лист успешно удален!');
			queryClient.invalidateQueries(['toDoList']);
			queryClient.invalidateQueries(['toDoListTitle']);
			queryClient.invalidateQueries(['toDoListContent']);
		},
		onError : (error) => {
			console.log('Ошибка!', error);
		},
	});
	
	const handleClickRemoveButton = (event) => {
		deleteCurrentList.mutate();
	};
	
	return (
		<div onClick={handleClickRemoveButton}>Remove</div>
	);
}

export default RemoveList;