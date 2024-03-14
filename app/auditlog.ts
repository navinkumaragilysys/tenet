import { ADDRESSESLINEORDERCONSTANTS, AUDITLOGAPTHCONSTANTS } from "./constants";
import type { Change, ChangeGroup, Logs, Node, Event } from "./model";


export class AuditLog {
    constructor() {
        console.log("AuditLog");
    }
    /**
     * Generates change logs based on the provided changes and events.
     * @param changes - An array of Change objects.
     * @param events - An array of Event objects.
     * @returns An array of strings representing the change logs.
     */
    static generateChangeLogs({
        changes,
        events,
    }: { changes: Change[]; events: Event[] }): string[] {
        const extralog: string[] = [];
        if (events != null && events.length > 0) {
            extralog.push(...AuditLog.getEventLog({ events: events }));
        }
        if (changes != null && changes.length > 0) {
            extralog.push(
                ...AuditLog.getLogs({
                    changes: AuditLog.getChanges({ changes: changes }),
                }),
            );
        }
        return extralog;
    }

    /**
     * Retrieves the event log based on the provided events.
     * @param {Object} params - The parameters for retrieving the event log.
     * @param {Event[]} params.events - The array of events.
     * @returns {string[]} - The event log.
     */
    static getEventLog({ events }: { events: Event[] }): string[] {
        const eventLog: string[] = [];
        for (const event of events) {
            const matchingEvent =
                AUDITLOGAPTHCONSTANTS.EVENTS[
                event.name as keyof typeof AUDITLOGAPTHCONSTANTS.EVENTS
                ];
            if (matchingEvent) {
                eventLog.push(matchingEvent.name);
            } else {
                eventLog.push(event.name);
            }
            if (event.attributes) {
                event.attributes.map((attribute) => {
                    const pathValue = attribute.path.map((path) => path.value).join(" ");
                    const lineValue = attribute.values
                        .map((path) => path.value)
                        .join("_");
                    eventLog.push(
                        `${AuditLog.toAuditLogCase({
                            entityType: pathValue,
                        })}${AuditLog.toCamelCase({ entityType: lineValue })}`,
                    );
                });
            }
        }
        return eventLog;
    }

    /**
     * Retrieves the changes and
     * maps(change.path and creates new ChangeGroup collection).
     * sorts with (ADDRESSESLINEORDERCONSTANTS).
     * groups with change.pathvalue.
     * @param {Change[]} changes - An array of changes.
     * @returns {Record<string, ChangeGroup[]>} A record containing the grouped changes.
     */
    static getChanges({
        changes,
    }: { changes: Change[] }): Record<string, ChangeGroup[]> {
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
     * iterates through the grouped collection and generates the LOG collection.
     * @param {Record<string, ChangeGroup[]>} changes - The changes to retrieve logs for.
     * @returns {string[]} An array of strings representing the combined logs for the changes.
     */
    static getLogs({
        changes,
    }: { changes: Record<string, ChangeGroup[]> }): string[] {
        let extralog = "";
        const combinedChanges: string[] = [];
        for (const [key, value] of Object.entries(changes)) {
            let previousPath = "";
            let isSamePath = false;
            extralog = "";
            for (const change of value) {
                const path = change.path
                    .slice(0, change.path.length - 1)
                    .map((path) => {
                        return AuditLog.toCamelCase({ entityType: path.value });
                    })
                    .join("");
                const lineValue = change.path
                    .slice(change.path.length - 1, change.path.length)
                    .map((path) => {
                        return AuditLog.toCamelCase({ entityType: path.value });
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
                            ? `${AuditLog.getOperationDescription({
                                operation: change.type,
                            })} ${AuditLog.toCamelCase({
                                entityType: key,
                            })}/${lineValue} ${change.to}`
                            : `${extralog}, ${lineValue}- ${change.to}`;
                        break;
                    case "UPDATE":
                        combinedChanges.push(
                            `${AuditLog.toCamelCase({
                                entityType: key,
                            })}/${lineValue} ${AuditLog.getOperationDescription({
                                operation: change.type,
                            })} from ${change.from} to ${change.to}`,
                        );
                        break;
                    case "REMOVE":
                        extralog = !isSamePath
                            ? `${AuditLog.getOperationDescription({
                                operation: change.type,
                            })} ${AuditLog.toCamelCase({
                                entityType: key,
                            })}/${lineValue}- ${change.from}`
                            : `${extralog}, ${lineValue}- ${change.from}`;
                        break;
                }
            }
            if (extralog !== "") combinedChanges.push(extralog.trim());
        }
        return combinedChanges;
    }

    /**
     * Converts a string to camel case.
     * @param {object} params - The parameters for the conversion.
     * @param {string} params.entityType - The string to convert to camel case.
     * @returns {string} The camel case version of the input string.
     */
    static toCamelCase({ entityType }: { entityType: string }): string {
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
     * Converts the given entity type to its corresponding audit log case.
     * @param {object} params - The parameters for the conversion.
     * @param {string} params.entityType - The entity type to convert.
     * @returns {string} The converted audit log case.
     */
    static toAuditLogCase({ entityType }: { entityType: string }): string {
        let entityTypeValue = entityType;
        entityTypeValue =
            AUDITLOGAPTHCONSTANTS.CHANGES.find((change) => {
                return change.type === entityType;
            })?.name ?? "";
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
     * Returns the description of the operation based on the provided operation string.
     * If the operation is not found in the operationMap, the original operation string is returned.
     * @param {object} params - The parameters object.
     * @param {string} params.operation - The operation string.
     * @returns {string} - The description of the operation.
     */
    static getOperationDescription({ operation }: { operation: string }): string {
        const operationMap: { [key: string]: string } = {
            ADD: "Added",
            UPDATE: "Changed",
            REMOVE: "Removed",
        };
        return operationMap[operation] || operation;
    }

    /**
     * Processes a log node and returns the corresponding Logs object.
     * @param {Node} node - The log node to process.
     * @returns {Logs} The Logs object containing the processed log information.
     */
    static processLogNode(node: Node): Logs {
        return {
            entityName: AuditLog.toCamelCase({ entityType: node.type ?? "" }),
            label: AuditLog.toCamelCase({ entityType: node.label ?? "" }),
            changeCount: (node.changes?.length || 0),
            user: node.user,
            dateTime: node.timestamp,
            logs: AuditLog.generateChangeLogs({
                changes: node.changes ?? [],
                events: node.events ?? [],
            }),
        };
    }
}
