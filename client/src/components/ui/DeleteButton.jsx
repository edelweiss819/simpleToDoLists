import React from 'react';
import Cross from '../../assets/Cross.jsx';

function DeleteButton({onClick, className}) {
	return (
		<div className={className}>
			<Cross color={'var(--primary-gray)'} onClick={onClick}/>
		</div>
	);
}

export default DeleteButton;
