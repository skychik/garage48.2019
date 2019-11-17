import React from 'react';

import './Header.css';

const Header = (props) => {
	return (
		<div className="header">
			<img src="/img/logo.png" alt="" style={{
				width: "40px",
				height: "40px",
			}}/>
			<div className="header_content">
				Tensyteam
			</div>
		</div>
	);
};

export default Header;
