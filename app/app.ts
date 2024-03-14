import * as fs from "fs";
import { AuditLog } from "./auditlog.js";
import type { GraphResponse, Logs } from "./model.js";

const filePath = "./AuditCommitByFilter.json";
function printLogs(logs: Logs[]): void {
	console.log(JSON.stringify(logs, null, 2));
}


fs.readFile(filePath, "utf8", (err, data) => {
	if (err) {
		console.error("Error reading file:", err);
		return;
	}

	try {
		const jsonData: GraphResponse = JSON.parse(data);
		const logs: Logs[] = jsonData.data.auditCommitByFilter.nodes.map((node) =>
			AuditLog.processLogNode(node)
		);
		printLogs(logs);
	} catch (err) {
		console.error("Error parsing JSON:", err);
	}
});
