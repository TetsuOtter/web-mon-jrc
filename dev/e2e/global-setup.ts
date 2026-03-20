import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { FullConfig } from "@playwright/test";

export default async function globalSetup(_config: FullConfig): Promise<void> {
	const e2eDir = path.dirname(fileURLToPath(import.meta.url));
	const workspaceRoot = path.resolve(e2eDir, "../..");

	execSync("yarn --cwd dev/canvas-renderer build", {
		cwd: workspaceRoot,
		stdio: "inherit",
	});
}
