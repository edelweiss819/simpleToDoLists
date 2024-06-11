import React from 'react';
import styles from './AddButton.module.css';

function AddButton({onClick}) {
	return (
		<div className={styles.AddButton} onClick={onClick}>Add</div>
	);
}

export default AddButton;

