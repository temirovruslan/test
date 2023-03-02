import React from "react";
import logo from "../assets/logo.svg";
import Button from "./Button";
import "../styles/Header.scss";

const Header = () => {
	return (
		<header className="header">
			<div className="header_left-side">
				<img src={logo} alt="logo" />
				<p>TESTTASK</p>
			</div>
			<div className="header_right-side">
				<Button value="Users" />
				<Button value="Sign up" />
			</div>
		</header>
	);
};

export default Header;
