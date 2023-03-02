import React from "react";
import logo from "../assets/logo.svg";
import Button from "./Button";
import "../styles/Header.scss";

const Header = () => {
	return (
		<header className="header">
			<div className="wrapper">
				<div className="header-block">
					<div className="header_left-side">
						<img src={logo} alt="logo" />
						<p>TESTTASK</p>
					</div>
					<div className="header_right-side">
						<Button className="btn-first" value="Users" />
						<Button className="btn-second" value="Sign up" />
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
