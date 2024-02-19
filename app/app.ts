import * as fs from 'fs';
import { Change, ChangesArray, GraphResponse, Logs, Node } from './model.js';

const filePath = './AuditCommitByFilter.json';

function toCamelCase(entityType: string): string {
    return entityType.split(/(?=[A-Z])/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function splitAndCombineLabel(label: string): string {
    return label.split(/[^a-zA-Z0-9]/).filter(Boolean).join(' ');
}

function updateOperation(operation: string): string {
    const operationMap: { [key: string]: string } = {
        ADD: 'Added',
        UPDATE: 'Changed',
        REMOVE: 'Removed'
    };
    return operationMap[operation] || operation;
}

function formatPath(path: string): string {
    return toCamelCase(path);
}

function formatFromTo(text: string): string {
    const regex = /\b[a-zA-Z\s]+:[a-zA-Z\s]+\b/i;
    const regexuuid = /\b([\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}):/i;
    const replacedText = text.replace(regexuuid, '');
    const [entityType, value] = replacedText.split(':');
    const formattedEntityType = toCamelCase(entityType);
    return (formattedEntityType && value) ? `${formattedEntityType} - ${value}` : text;
}

function processChanges(changes: Change[]): string[] {
    const combinedChanges: string[] = [];

    // Iterate over each change
    for (const change of changes) {
        let logs = "";
        if (change.operation) {
            logs = updateOperation(change.operation);
        }
        if (change.path) {
            logs = `${logs} ${formatPath(change.path)}`;
        }
        // Check if 'from' is not null/empty and add it to combinedChanges
        if (change.from) {
            logs = `${logs} ${change.from ? formatFromTo(change.from) : ''}`;
        }
        // Check if 'to' is not null/empty and add it to combinedChanges
        if (change.to) {
            logs = `${logs} ${change.to ? formatFromTo(change.to) : ''}`;
        }
        combinedChanges.push(logs);
    }
    // Return the combinedChanges array directly
    return combinedChanges;
}

function processNode(node: Node): Logs {
    return {
        entityName: toCamelCase(node.entityType),
        label: node.label ? splitAndCombineLabel(node.label) : '',
        changeCount: node.changes.length,
        user: node.user,
        logs: processChanges(node.changes)
    };
}

function processLogs(logs: Logs[]): void {
    // for (const log of logs) {
    //     console.log(`Entity Name: ${log.entityName}`);
    //     console.log(`Label: ${log.label}`);
    //     console.log(`Change Count: ${log.changeCount}`);
    //     console.log(`User: ${log.user}`);
    //     console.log('Changes:');
    //     console.log(log.logs);
    //     console.log();
    // }

    // print json data
    console.log(JSON.stringify(logs, null, 2));

}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        const jsonData: GraphResponse = JSON.parse(data);
        const logs: Logs[] = jsonData.data.auditCommitByFilter.nodes.map(processNode);
        processLogs(logs);
    } catch (err) {
        console.error('Error parsing JSON:', err);
    }
});