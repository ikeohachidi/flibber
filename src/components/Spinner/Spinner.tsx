import React from 'react';
import './Spinner.css';

type Props = {
	fullSize?: boolean;
	size?: string;
}

const Spinner = (props: Props) => {
	if (props.fullSize) {
		return (
			<div className="loader-spinner-wrapper">
				<div 
					className="loader-spinner"
					style={{
						height: props.size,
						width: props.size
					}}
				></div>
			</div>	
		)
	}
	return (
		<div className="loader-spinner"></div>
	)
}

Spinner.defaultProps = {
	fullSize: false,
	size: '40px'
}

export default Spinner;