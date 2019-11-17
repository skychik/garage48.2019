import React from 'react';

import './Header.css';

const Header = (props) => {
	return (
		<div className="header">
			<img src="/img/logo.png" alt="" style={{
				width: "40px",
				height: "40px",
				position: 'fixed',
				border: 0,
				top: 0, left: 0,
			}}/>
			<div className="header_content">
				Tensyteam
			</div>
		</div>
	);
};

export default Header;
