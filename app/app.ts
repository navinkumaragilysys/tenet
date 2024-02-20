import * as fs from 'fs';
import { Change, ChangesArray, GraphResponse, Logs, Node } from './model.js';

const filePath = './AuditCommitByFilter.json';
const RX_UUID = /\b([\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}):/i;
const RX_UUID_NO_DASH = /\b[\da-f]{24}:[a-z]+:[\w\s]+/i;
const RX_DATE_TIME = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})/;
const PATH_NUM = /:\d/g;

function convertToCamelCase(entityType: string): string {
    if (entityType === entityType.toUpperCase()) {
        return entityType.replace('::', '');
    }
    return entityType.split(/(?=[A-Z])/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function cleanAndCombineLabel(label: string): string {
    return label.split(/[^a-zA-Z0-9]/).filter(Boolean).join(' ');
}

function getOperationDescription(operation: string): string {
    const operationMap: { [key: string]: string } = {
        ADD: 'Added',
        UPDATE: 'Changed',
        REMOVE: 'Removed'
    };
    return operationMap[operation] || operation;
}

function formatChangePath(path: string): string {
    return convertToCamelCase(path);
}

function formatUUIDText(text: string): string {
    const [entityType, value] = text.split(':');
    const formattedEntityType = convertToCamelCase(entityType);
    return (formattedEntityType && value) ? `${formattedEntityType} - ${value}` : text;
}

function formatChangeText(text: string): string {
    if (RX_DATE_TIME.test(text)) {
        // const date = new Date(text);
        // return date.toDateString();
        return text;
    }
    else {
        const cleanedText = formatUUIDText(text.replace(/[+/*\\%\-]/g, ' '));
        return cleanedText;
    }
}

function generateChangeLogs(changes: Change[]): string[] {
    const combinedChanges: string[] = [];
    let path: String = '';
    let isSamePath: boolean = false;
    let lineNumber = 0;
    let isSameLine: boolean = false;
    for (const change of changes) {
        let logs = "";
        ({ isSamePath, path } = splitPath(change, isSamePath, path));
        const duplicatePath = change.path.split('/').filter(Boolean);
        if (duplicatePath.length > 1) {
            let currentLineNumber = extractNumericValue(duplicatePath[1]);
            if (lineNumber === currentLineNumber) {
                isSameLine = true;
            }
            else {
                isSameLine = false;
                lineNumber = currentLineNumber;
            }
        }

        if (change.operation && !isSameLine) {
            logs = getOperationDescription(change.operation);
        }
        logs = addLogs(change, logs, isSameLine);

        if (isSamePath && isSameLine) {
            combinedChanges[combinedChanges.length - 1] = `${combinedChanges[combinedChanges.length - 1]} ${logs}`;
        }
        else {
            combinedChanges.push(logs);
            isSameLine = false;
        }
    }
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

function splitPath(change: Change, isSamePath: boolean, path: String) {
    const splitPath = change.path.replace(PATH_NUM, '').split('/').filter(Boolean);
    if (splitPath.length > 0) {
        isSamePath = path === splitPath[0];
        path = splitPath[0];
    }
    else { path = ''; isSamePath = false; }
    //console.log('path', path);
    //console.log('isSamePath', isSamePath);
    return { isSamePath, path };
}

function replacePattern(input: string): string {
    // Define the regular expression pattern to match '/:1/'
    const regex = /\/:1\//g;

    // Replace all occurrences of the pattern with a space
    const replacedString = input.replace(regex, ' ');

    return replacedString;
}

function addLogs(change: Change, logs: string, isSamePath: boolean) {
    if (change.path) {
        if (change.operation === 'UPDATE') {
            logs = `${formatChangePath(change.path)}`;
        }
        else {
            if (isSamePath) {
                const duplicatePath = change.path.split('/').filter(Boolean);
                logs = `${logs} ${formatChangePath(duplicatePath[duplicatePath.length - 1])}`;
            }
            else {
                logs = `${logs} ${formatChangePath(change.path)}`;

            }
        }
    }
    logs = formatChangePath(replacePattern(logs));

    const fromValue = change.from?.split(':').filter(Boolean);
    if (fromValue && fromValue.length > 1) {
        change.from = change.from?.split(':').slice(1).join(':');
    }
    const toValue = change.to?.split(':').filter(Boolean);
    if (toValue && toValue.length > 1) {
        change.to = change.to?.split(':').slice(1).join(':');
    }

    if (change.from) {
        if (change.operation === 'UPDATE')
            logs = `${logs} ${getOperationDescription(change.operation)} from ${formatChangeText(decodeURIComponent(change.from))}`;
        else
            logs = `${logs} ${change.from ? formatChangeText(decodeURIComponent(change.from)) : ''}`;
    }
    if (change.to) {
        if (change.operation === 'UPDATE')
            logs = `${logs} to ${formatChangeText(decodeURIComponent(change.to))}`;
        else
            logs = `${logs} ${change.to ? formatChangeText(decodeURIComponent(change.to)) : ''}`;
    }
    return logs;
}

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