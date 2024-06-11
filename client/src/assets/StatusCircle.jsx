import * as React from 'react';

const StatusCircle = ({color, onClick}) => (
	<svg
		width={20}
		height={20}
		viewBox="0 0 26 26"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		onClick={onClick}
	>
		<desc>{'\n\t\t\tCreated with Pixso.\n\t'}</desc>
		<defs/>
		<circle
			id="Ellipse 1"
			cx={13}
			cy={13}
			r={13}
			fill={color}
			fillOpacity={1}
		/>
	</svg>
);
export default StatusCircle;
