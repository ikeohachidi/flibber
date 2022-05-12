import React from 'react';
import './Spinner.css';

type Props = {
	fullSize: boolean;
}

const Spinner = (props: Props) => {
	if (props.fullSize) {
		return (
			<div className="loader-spinner-wrapper">
				<div className="loader-spinner"></div>
			</div>	
		)
	}
	return (
		<div className="loader-spinner"></div>
	)
}

export default Spinner;