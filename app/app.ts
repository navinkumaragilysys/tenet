import * as fs from "fs";
import {
	Change,
	GraphResponse,
	Logs,
	Node,
	ChangeGroup,
	Event,
} from "./model.js";
import {
	ADDRESSESLINEORDERCONSTANTS,
	AUDITLOGAPTHCONSTANTS,
} from "./auditLogConstants.js";

const filePath = "./AuditCommitByFilter.json";

/**
 * Generates change logs based on the provided changes and node.
 *
 * @param changes - An array of changes.
 * @param node - The node to generate change logs for.
 * @returns An array of change logs.
 */
function generateChangeLogs(changes: Change[], events: Event[]): string[] {
	const combinedChanges: string[] = [];

	const result = changes
		.filter((change) => {
			return change.type === "ADD" || change.type === "UPDATE";
		})
		.map((change) => {
			let pathValue = change.path
				?.slice(0, change.path.length - 1)
				.map((path) => path.value)
				.join("_");
			const lineValue = change.path
				?.slice(change.path.length - 1, change.path.length)
				.map((path) => path.value)
				.join("_");
			if (pathValue === "") {
				pathValue = change.path.map((path) => path.value).join("_");
			}
			const fromValue = change.from?.map((from) => from.value).join(",");
			const toValue = change.to?.map((to) => to.value).join(",");
			const changeGroup: ChangeGroup = {
				type: change.type,
				pathvalue: toCamelCase(pathValue),
				lineValue: lineValue,
				from: fromValue,
				to: toValue,
				path: change.path,
			};
			return changeGroup;
		})
		.sort((a, b) => {
			const indexA = ADDRESSESLINEORDERCONSTANTS.indexOf(a.pathvalue);
			const indexB = ADDRESSESLINEORDERCONSTANTS.indexOf(b.pathvalue);

			if (indexA === -1 && indexB === -1) return 0; // a and b are not in the order array, consider them equal
			if (indexA === -1) return 1; // a is not in the order array, it should come after b
			if (indexB === -1) return -1; // b is not in the order array, it should come after a

			return indexA - indexB; // both a and b are in the order array, sort them based on their positions
		})
		.reduce(
			(acc: Record<string, ChangeGroup[]>, change) => {
				if (acc[change.pathvalue]) {
					acc[change.pathvalue].push(change);
				} else {
					acc[change.pathvalue] = [change];
				}
				return acc;
			},
			{} as Record<string, ChangeGroup[]>,
		);
	console.log(result);

	return combinedChanges;
}

function getLogs(
	change: Change,
	sameLine: boolean,
	log: string,
	currentPathvalue: string,
) {
	let extralog = log;
	switch (change.type) {
		case "ADD":
			if (sameLine) {
				extralog = `${log}  ${change.to.map((to) => to.value).join(",")}`;
			} else {
				extralog = `${getOperationDescription(
					change.type,
				)} ${currentPathvalue} ${change.to.map((to) => to.value).join(",")}`;
			}
			break;
		case "UPDATE":
			extralog = `${currentPathvalue} ${getOperationDescription(
				change.type,
			)} from ${change.from.map((from) => from.value).join(",")} to ${change.to
				.map((to) => to.value)
				.join(",")}`;
			break;
		case "REMOVE":
			if (sameLine) {
				extralog = `${log}  ${change.from.map((from) => from.value).join(",")}`;
			} else {
				extralog = `${getOperationDescription(
					change.type,
				)} ${currentPathvalue} ${change.from
					.map((from) => from.value)
					.join(",")}`;
			}
			break;
	}
	return extralog;
}

function toCamelCase(entityType: string): string {
	if (entityType === entityType.toUpperCase()) {
		return entityType;
	}
	const replacedEntityType = entityType.replace(/[A-Z]/g, " $&");
	return replacedEntityType[0].toUpperCase() + replacedEntityType.slice(1);
}

function toAuditLogCase(entityType: string): string {
	let entityTypeValue = entityType;
	entityTypeValue = AUDITLOGAPTHCONSTANTS.CHANGES.find((change) => {
		return change.type === entityType;
	})?.name;
	if (entityTypeValue === undefined) {
		if (entityType === entityType.toUpperCase()) {
			return entityType;
		}
		const replacedEntityType = entityType.replace(/[A-Z]/g, " $&");
		return replacedEntityType[0].toUpperCase() + replacedEntityType.slice(1);
	}
	return entityTypeValue;
}

function getOperationDescription(operation: string): string {
	const operationMap: { [key: string]: string } = {
		ADD: "Added",
		UPDATE: "Changed",
		REMOVE: "Removed",
	};
	return operationMap[operation] || operation;
}

/**
 * This function converts a string to camel case
 * @param node node to be processed
 * @returns logs
 * * Please note that the return type is Logs
 * TODO: implement the function to process the node
 */
function processLogNode(node: Node): Logs {
	return {
		entityName: toCamelCase(node.type),
		label: toCamelCase(node.label ? node.label : ""),
		changeCount: node.changes?.length || node.events?.length || 0,
		user: node.user,
		logs:
			node.changes && node.changes.length > 0
				? generateChangeLogs(node.changes, node.events)
				: [],
	};
}

function printLogs(logs: Logs[]): void {
	//console.log(JSON.stringify(logs, null, 2));
}

fs.readFile(filePath, "utf8", (err, data) => {
	if (err) {
		console.error("Error reading file:", err);
		return;
	}

	try {
		const jsonData: GraphResponse = JSON.parse(data);
		if (
			jsonData.data?.auditCommitByFilter &&
			Array.isArray(jsonData.data.auditCommitByFilter.nodes)
		) {
			const logs: Logs[] =
				jsonData.data.auditCommitByFilter.nodes.map(processLogNode);
			printLogs(logs);
		} else {
			console.error("Invalid data structure:", jsonData);
		}
	} catch (err) {
		console.error("Error parsing JSON:", err);
	}
});
