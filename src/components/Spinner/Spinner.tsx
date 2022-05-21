import React from 'react';
import './Spinner.css';

type Props = {
	fullSize?: boolean;
	size?: string;
}

const CircleLoader = ({ size }: { size: string }) => {
	return (
		<div 
			className="loader-spinner"
			style={{
				height: size,
				width: size
			}}
		></div>
	)
}

const Spinner = (props: Props) => {
	if (props.fullSize) {
		return (
			<div className="loader-spinner-wrapper">
				<CircleLoader size={props.size as string}/>
			</div>	
		)
	}
	return (
		<CircleLoader size={props.size as string}/>
	)
}

Spinner.defaultProps = {
	fullSize: false,
	size: '40px'
}

export default Spinner;