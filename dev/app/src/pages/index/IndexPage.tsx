import { memo } from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "../../router-paths";

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
						<Link to={ROUTES.TYPE313S.path}>Type 313S</Link>
					</li>
					<li>
						<Link to={ROUTES.TYPE313V.path}>Type 313V</Link>
					</li>
					<hr />
					<li>
						<Link to={ROUTES.CANVAS_DEMO.path}>Canvas Demo</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
});
