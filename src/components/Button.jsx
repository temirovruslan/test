import React from "react";
import "../styles/Button.scss";

const Button = ({ value, type, state, className, onClick }) => {
	return (
		<button type={type} onClick={onClick} className={`btn ${className} `}>
			{value}
		</button>
	);
};

export default Button;
