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
 * Generates change logs based on the provided changes and events.
 *
 * @param changes - An array of changes.
 * @param events - An array of events.
 * @returns An array of change logs.
 */
function generateChangeLogs(changes: Change[], events: Event[]): string[] {
	const extralog: string[] = [];
	if (events != null && events.length > 0) {
		extralog.push(...getEventLog(events));
	}
	if (changes != null && changes.length > 0) {
		extralog.push(...getLogs(getChanges(changes)));
	}
	return extralog;
}

/**
 * Generate Event log based on the provided events
 * @param events Array[] of events
 * @returns String[] of event logs
 */
function getEventLog(events: Event[]): string[] {
	const eventLog: string[] = [];
	for (const event of events) {
		const matchingEvent = AUDITLOGAPTHCONSTANTS.EVENTS[event.name];
		if (matchingEvent) {
			eventLog.push(matchingEvent.name);
		} else {
			eventLog.push(event.name);
		}
		if (event.attributes) {
			event.attributes.map((attribute) => {
				const pathValue = attribute.path.map((path) => path.value).join(" ");
				const lineValue = attribute.values.map((path) => path.value).join("_");
				eventLog.push(`${toAuditLogCase(pathValue)}${toCamelCase(lineValue)}`);
			});
		}
	}
	return eventLog;
}

/**
 * Generate changes based on the provided changes
 * @param changes  Array[] of changes
 * @returns  Record<string, ChangeGroup[]>
 */
function getChanges(changes: Change[]): Record<string, ChangeGroup[]> {
	return changes
		.map((change) => {
			// Transform the changes into groups
			let pathValue = change.path
				?.slice(0, change.path.length - 1)
				.map((path) => path.value)
				.join("/");
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
				pathvalue: pathValue,
				lineValue: lineValue,
				from: fromValue,
				to: toValue,
				path: change.path,
			};
			return changeGroup;
		})
		.sort((a, b) => {
			// Sort the change groups based on the order in ADDRESSESLINEORDERCONSTANTS
			const indexA = ADDRESSESLINEORDERCONSTANTS.map((v) =>
				v.toLowerCase(),
			).indexOf(a.lineValue.toLowerCase());
			const indexB = ADDRESSESLINEORDERCONSTANTS.map((v) =>
				v.toLowerCase(),
			).indexOf(b.lineValue.toLowerCase());
			if (indexA === -1 && indexB === -1) return 0; // a and b are not in the order array, consider them equal
			if (indexA === -1) return 1; // a is not in the order array, it should come after b
			if (indexB === -1) return -1; // b is not in the order array, it should come after a
			return indexA - indexB; // both a and b are in the order array, sort them based on their positions
		})
		.reduce(
			// Group the sorted change groups by pathvalue
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
}

/**
 *
 * @param changes record of changes whic is sorted and grouped
 * @returns changes in the form of string array
 */
function getLogs(changes: Record<string, ChangeGroup[]>): string[] {
	let extralog = "";
	const combinedChanges: string[] = [];
	for (const [key, value] of Object.entries(changes)) {
		extralog = "";
		let previousPath = "";
		let isSamePath = false;
		for (const change of value) {
			const path = change.path
				.slice(0, change.path.length - 1)
				.map((path) => {
					return toCamelCase(path.value);
				})
				.join("");
			const lineValue = change.path
				.slice(change.path.length - 1, change.path.length)
				.map((path) => {
					return toCamelCase(path.value);
				})
				.join("/");

			const pathValue = `${change.type}${key}${path}`;
			if (previousPath === "" || previousPath !== pathValue) {
				previousPath = pathValue;
				isSamePath = false;
				if (extralog !== "") combinedChanges.push(extralog.trim());
				extralog = "";
			} else {
				isSamePath = true;
			}

			switch (change.type) {
				case "ADD":
					extralog = !isSamePath
						? `${getOperationDescription(change.type)} ${toCamelCase(
								key,
						  )}/${lineValue} ${change.to}`
						: `${extralog}, ${lineValue}- ${change.to}`;
					break;
					
				case "UPDATE":
					console.log(
						`${getOperationDescription(change.type)} <-> ${toCamelCase(
							key,
						)} <> ${path} #SAME?#=${isSamePath} /${lineValue} from=${
							change.from
						} to=${change.to}`,
					);
					combinedChanges.push(
						`${toCamelCase(key)}/${lineValue} ${getOperationDescription(
							change.type,
						)} from ${change.from} to ${change.to}`,
					);
					break;
				case "REMOVE":
					extralog = !isSamePath
						? `${getOperationDescription(change.type)} ${toCamelCase(
								key,
						  )}/${lineValue}- ${change.from}`
						: `${extralog}, ${lineValue}- ${change.from}`;
					break;
			}
		}
		if (extralog !== "") combinedChanges.push(extralog.trim());
	}
	return combinedChanges;
}

/**
 *
 * @param entityType entity type to be converted to camel case
 * @returns returns the entity type in camel case
 */
function toCamelCase(entityType: string): string {
	// Split the string into words
	const words = entityType.split(/(?=[A-Z])/);

	// Map each word to its camel case version, unless it's already in uppercase
	const camelCasedWords = words.map((word) =>
		word === word.toUpperCase()
			? word
			: word[0].toUpperCase() + word.slice(1).toLowerCase(),
	);

	// Join the words back together
	return camelCasedWords.join("");
}

/**
 * Provides the audit log case for the entity type
 * @param entityType entity type to be converted to audit log case
 * @returns returns the entity type in audit log case
 * !Important: use this function only when you want to change the eventType to audit log case
 */
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

/**
 * This function returns the description of the operation
 * @param operation operation to be processed
 * @returns operation description
 */
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
 */
function processLogNode(node: Node): Logs {
	return {
		entityName: toCamelCase(node.type),
		label: toCamelCase(node.label ? node.label : ""),
		changeCount: node.changes?.length || node.events?.length || 0,
		user: node.user,
		logs: generateChangeLogs(node.changes, node.events),
	};
}

function printLogs(logs: Logs[]): void {
	const fileName = `${Math.random().toString(36).substring(2, 15)}.json`;

	// Stringify the logs object
	const data = JSON.stringify(logs, null, 2);

	fs.writeFile(fileName, data, (err) => {
		if (err) {
			console.error("Error writing file", err);
		} else {
			console.log("Successfully wrote file");
		}
	});
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
