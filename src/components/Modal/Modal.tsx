import React, { useEffect, useState, MouseEvent, useRef } from 'react';
import ReactDOM from 'react-dom';

import './Modal.css';

type Props = {
	children: React.ReactNode,
	show: boolean,
	onClose: () => void;
} & typeof defaultProps;

const AddContactModal = (props: Props) => {
	const portalContainer = useRef<HTMLDivElement>(null);

	const closeModal = (event: MouseEvent<HTMLDivElement>) => {
		if (event.target === portalContainer.current) {
			props.onClose();
		}
	}
	
	const [el] = useState(() => {
		return document.createElement('div');
	});

	useEffect(() => {
		document.body.appendChild(el);
		return () => {
			document.body.removeChild(el);
		}
	}, [])

	return (
		ReactDOM.createPortal(
			<div className={`${ !props.show && 'hide' } modal-container`} onClick={ closeModal } ref={ portalContainer }>
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