import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import DeleteButton from './ui/DeleteButton.jsx';
import { fetchInitialState } from '../store/slices/selectedToDoListSlice.jsx';
import { useDispatch } from 'react-redux';
import { ipp } from '../../ip.js';

function RemoveList({toDoListId, className}) {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();
	
	const deleteCurrentListReq = async () => {
		await axios.delete(`http://${ipp}/api/DeleteToDoListsById/${toDoListId}`);
	};
	
	const deleteCurrentList = useMutation({
		mutationFn : deleteCurrentListReq,
		onSuccess : () => {
			// console.log('Лист успешно удален!');
			queryClient.invalidateQueries({queryKey : ['toDoList']});
			queryClient.invalidateQueries({queryKey : ['toDoListTitle']});
			queryClient.invalidateQueries({queryKey : ['toDoListContent']});
			queryClient.invalidateQueries(['toDoListsArr']);
			dispatch(fetchInitialState());
		},
		onError : (error) => {
			console.log('Ошибка!', error);
		},
	});
	
	const handleClickRemoveButton = (event) => {
		deleteCurrentList.mutate();
		
	};
	
	return (
		<div className={className}
			 onClick={handleClickRemoveButton}><DeleteButton/></div>
	);
}

export default RemoveList;