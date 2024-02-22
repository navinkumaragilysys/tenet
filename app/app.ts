import * as fs from 'fs';
import { Change, GraphResponse, Logs, Node } from './model.js';

const filePath = './AuditCommitByFilter.json';


function generateChangeLogs(changes: Change[], node: Node): string[] {
    const combinedChanges: string[] = [];
    let previousPath = '';
    let sameLine = false;
    let log = '';
    for (const change of changes) {
        let currentPath = change.path.slice(0, 2).map((path) => path.value).join('_');
        const currentPathvalue = change.path.map((path) => toCamelCase(path.value)).join(' ');
        if (currentPath.toLocaleLowerCase() === previousPath.toLocaleLowerCase()) {
            sameLine = true;
        }
        else {
            previousPath = currentPath;
            sameLine = false;
        }
        log = getLogs(change, sameLine, log, currentPathvalue);
        if (!sameLine) {
            combinedChanges.push(log);
        }
    };
    return combinedChanges;
}

function getLogs(change: Change, sameLine: boolean, log: string, currentPathvalue: string) {
    let extralog = log;
    switch (change.type) {
        case 'ADD':
            if (sameLine) {
                extralog = `${log}  ${change.to.map((to) => to.value).join(',')}`;
            }
            else {
                extralog = `${getOperationDescription(change.type)} ${currentPathvalue} ${change.to.map((to) => to.value).join(',')}`;
            }
            break;
        case 'UPDATE':
            extralog = `${currentPathvalue} ${getOperationDescription(change.type)} from ${change.from.map((from) => from.value).join(',')} to ${change.to.map((to) => to.value).join(',')}`;
            break;
        case 'REMOVE':
            if (sameLine) {
                extralog = `${log}  ${change.from.map((from) => from.value).join(',')}`;
            }
            else {
                extralog = `${getOperationDescription(change.type)} ${currentPathvalue} ${change.from.map((from) => from.value).join(',')}`;
            }
            break;
    }
    return extralog;
}

function extractNumericValue(input: string): number {
    const regex = /\d+/; // Match one or more digits
    const match = input.match(regex);
    if (match) {
        // Convert the matched string to a number
        return parseInt(match[0], 10);
    }
    return 0; // Return 0 if no numeric value is found
}

function toCamelCase(entityType: string): string {
    if (entityType === entityType.toUpperCase()) {
        return entityType;
    }
    const replacedEntityType = entityType.replace(/[A-Z]/g, " $&");
    return replacedEntityType[0].toUpperCase() + replacedEntityType.slice(1);
}

function getOperationDescription(operation: string): string {
    const operationMap: { [key: string]: string } = {
        ADD: 'Added',
        UPDATE: 'Changed',
        REMOVE: 'Removed'
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
        label: toCamelCase(node.label ? node.label : ''),
        changeCount: node.changes?.length || node.events?.length || 0,
        user: node.user,
        logs: node.changes && node.changes.length > 0 ? generateChangeLogs(node.changes, node) : []
    };
}

function printLogs(logs: Logs[]): void {
    console.log(JSON.stringify(logs, null, 2));
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        const jsonData: GraphResponse = JSON.parse(data);
        jsonData.data.auditCommitByFilter.nodes.map
        const logs: Logs[] = jsonData.data.auditCommitByFilter.nodes.map(processLogNode);
        printLogs(logs);
    } catch (err) {
        console.error('Error parsing JSON:', err);
    }
});
