import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import './Modal.css';

type Props = {
	children: React.ReactNode,
	show: boolean
} & typeof defaultProps;

const AddContactModal = (props: Props) => {
	const appRoot = document.getElementById('root');
	const el = document.createElement('div');
	appRoot?.appendChild(el);

	return (
		ReactDOM.createPortal(
			<div className={`${ !props.show && 'hide' } modal-container`}>
				{ props.children }
			</div>	
			,
			el
		)
	)
}

const defaultProps = {
	show: false,
}

AddContactModal.defaultProps = defaultProps; 

export default AddContactModal;