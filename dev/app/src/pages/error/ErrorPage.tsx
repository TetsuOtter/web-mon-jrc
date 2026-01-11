import { memo } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default memo(function ErrorPage() {
	const errorInfo = useRouteError();
	const typedErrorInfo = isRouteErrorResponse(errorInfo)
		? errorInfo
		: errorInfo instanceof Error
			? {
					status: 500,
					statusText: "Internal Server Error",
					data: errorInfo.message,
				}
			: undefined;

	return (
		<div>
			<h1>
				{typedErrorInfo?.status} {typedErrorInfo?.statusText}
			</h1>
			<p>{typedErrorInfo?.data}</p>
		</div>
	);
});
