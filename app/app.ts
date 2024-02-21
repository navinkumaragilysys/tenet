import * as fs from 'fs';
import { GraphResponse, Logs, Node } from './model.js';

const filePath = './AuditCommitByFilter.json';

function processLogNode(node: Node): Logs {
    return {
        entityName: convertToCamelCase(node.entityType),
        label: node.label ? cleanAndCombineLabel(node.label) : '',
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