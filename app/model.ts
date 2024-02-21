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
    cursor: string
    pageSize: number
    currentPage: number
    totalPages: number
    totalCount: number
}

export type Node = {
    type: string
    id: string
    label: string
    user: string
    timestamp: string
    transaction: string
    changes: Change[]
}

export type Change = {
    path: Path[]
    type: string
    to?: To[]
    collection: boolean
    from?: From[]
}

export type Path = {
    value: string
    type: string
}

export type To = {
    value: string
    references?: References
}

export type References = {
    type: string
    id: string
}

export type From = {
    value: string
}

export type Logs = {
    entityName: string
    label: string
    changeCount: number
    user: string
    logs: string[]
}
