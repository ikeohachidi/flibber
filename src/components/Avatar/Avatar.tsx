import React from 'react';
import './Avatar.css';
import faceImage from 'assets/images/face.jpg' ;

type Props = {
	image?: string;
	alt?: string;
	className?: string;
	dimension?: number;
} & typeof defaultProps 

const defaultProps = {
	image: faceImage,
	className: '',
	dimension: 20
}

const Avatar = (props: Props): JSX.Element => {
	const dimension = `${props.dimension}px`;

	const avatarStyle = {
		height: dimension,
		width: dimension
	}

	return (
		<div style={ avatarStyle } className={`avatar ${props.className}`}>
			<img src={ props.image } alt={ props.alt } />
		</div>
	)
}

Avatar.defaultProps = defaultProps; 

export default Avatar;