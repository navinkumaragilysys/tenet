import * as fs from 'fs';
import { Change, GraphResponse, Logs, Node } from './model.js';

const filePath = './AuditCommitByFilter.json';


function generateChangeLogs(changes: Change[]): string[] {
    const combinedChanges: string[] = [];
    let previousPath = '';
    let log = '';
    for (const change of changes) {
        const pathValues = change.path.map((path) => toCamelCase(path.value)).join(' ');
        const fromToValue = change.to && change.from
            ? `from ${change.to.map((to) => to.value).join(' ')} to ${change.from.map((from) => from.value).join(' ')}`
            : change.to
                ? change.to.map((to) => to.value).join(' ')
                : change.from
                    ? change.from.map((from) => from.value).join(' ')
                    : '';

        const currentPath = change.path.slice(0, 2).map(path => path.value).join('_');
        const typeValues = change.path.map((path) => path.type).join(' ');

        if (String.prototype.toLowerCase.call(currentPath) === String.prototype.toLowerCase.call(previousPath)) {
            console.log(`   ${fromToValue}`);
            continue;
        }

        previousPath = currentPath;
        console.log(`${getOperationDescription(change.type)} ${pathValues} ${fromToValue}`);
        switch (change.type) {
            case 'ADD':
                log = `${getOperationDescription(change.type)} ${pathValues} ${fromToValue}`;
                break;
            case 'UPDATE':
                log = `${pathValues} ${getOperationDescription(change.type)} ${fromToValue}`;
                break;
            case 'REMOVE':
                log = `${getOperationDescription(change.type)} ${pathValues} ${fromToValue}`;
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
        logs: node.changes && node.changes.length > 0 ? generateChangeLogs(node.changes) : []
    };
}

function printLogs(logs: Logs[]): void {
    //console.log(JSON.stringify(logs, null, 2));
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
