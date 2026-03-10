import { memo } from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "../../router-paths";

const PAGE_TYPES_MENU = "MENU";

export default memo(function IndexPage() {
	return (
		<div style={{ padding: "20px" }}>
			<h1>Web Mon JRC</h1>
			<nav>
				<ul>
					<li>
						<Link to={ROUTES.SETTINGS.path}>Settings</Link>
					</li>
					<li>
						<Link to={`/monitors/type313s/${PAGE_TYPES_MENU}`}>Type 313S</Link>
					</li>
					<li>
						<Link to={ROUTES.TYPE313S_EDIT.path}>Type 313S Edit</Link>
					</li>
					<li>
						<Link to={ROUTES.TYPE313V.path}>Type 313V</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
});
