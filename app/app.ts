import * as fs from 'fs';
import { Change, GraphResponse, Logs, Node } from './model.js';

const filePath = './AuditCommitByFilter.json';


function generateChangeLogs(changes: Change[]): string[] {
    const combinedChanges: string[] = [];
    let previousPath = "";
    let isSamePath = false;
    let logs = "";
    for (const change of changes) {

        let pathValues = change.path.map((path) => toCamelCase(path.value)).join(' ');
        const currentPath = change.path[0].value;

        if (previousPath.trim().toLowerCase() === currentPath.trim().toLowerCase()) {
            console.log(`previousPath: ${previousPath} currentPath: ${currentPath}`);
            pathValues = change.path.slice(1).map((path) => toCamelCase(path.value)).join(', ');

            isSamePath = true;
        } else {
            combinedChanges.push(logs.trim());
            logs = "";
            isSamePath = false;
            previousPath = currentPath;
        }
        switch (change.type) {
            case 'ADD':
                if (isSamePath) {
                    logs = change.to ? `${logs} ${pathValues} - ${change.to[0].value},` : ` ${logs} ${pathValues}`;
                    console.log('logs', logs);
                }
                else
                    logs = change.to ? `Added ${pathValues} - ${change.to[0].value}, ` : `Added ${pathValues}`;
                break;
            case 'UPDATE':
                logs = change.from && change.to ? `${pathValues} changed from ${change.from[0].value} to ${change.to[0].value}` : `${pathValues} changed`;
                break;
            case 'REMOVE':
                logs = `Removed ${pathValues}`;
                break;
        }

    };
    return combinedChanges;
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
    entityType = entityType.replace(/[A-Z]/g, " $&");
    return entityType[0].toUpperCase() + entityType.slice(1);
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
        changeCount: node.changes.length,
        user: node.user,
        logs: generateChangeLogs(node.changes)
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
        const logs: Logs[] = jsonData.data.auditCommitByFilter.nodes.map(processLogNode);
        printLogs(logs);
    } catch (err) {
        console.error('Error parsing JSON:', err);
    }
});
