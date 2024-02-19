export type GraphResponse = {
    data: Data
}
export type Data = {
    auditCommitByFilter: AuditCommitByFilter
}
export type AuditCommitByFilter = {
    pageInfo: PageInfo
    nodes: Node[]
}
export type PageInfo = {
    cursor?: string
    pageSize: number
    currentPage: number
    totalPages: number
    totalCount: number
}
export type Node = {
    id: string
    timeStamp: string
    entityType: string
    user: string
    label: string
    changes: Change[]
}
export type Change = {
    from?: string
    path: string
    source: string
    to: string
    operation: string
}


export type Changes = {
    from?: string
    path: string
    source: string
    to: string
    operation: string
}

export type ChangesArray = {
    changes: string[];
}

export type Logs = {
    entityName: string
    label: string
    changeCount: number
    user: string
    logs: string[]
}
