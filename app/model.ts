export type GraphResponse = {
    data: Data
}
export interface Root {
    data: Data
  }
  
  export interface Data {
    auditCommitByFilter: AuditCommitByFilter
  }
  
  export interface AuditCommitByFilter {
    pageInfo: PageInfo
    nodes: Node[]
  }
  
  export interface PageInfo {
    cursor: string
    pageSize: number
    currentPage: number
    totalPages: number
    totalCount: number
  }
  
  export interface Node {
    type: string
    id: string
    label: string
    user: string
    timestamp: string
    transaction: string
    changes?: Change[]
    events?: Event[]
  }
  
  export interface Change {
    path: Path[]
    type: string
    from?: From[]
    to?: To[]
    collection: boolean
  }
  
  export interface Path {
    value: string
    type: string
  }
  
  export interface From {
    value: string
    references?: References
  }
  
  export interface References {
    type: string
    id: string
  }
  
  export interface To {
    value: string
    references?: References2
  }
  
  export interface References2 {
    type: string
    id: string
  }
  
  export interface Event {
    name: string
    attributes?: Attribute[]
  }
  
  export interface Attribute {
    path: Path2[]
    values: Value[]
    collection: boolean
  }
  
  export interface Path2 {
    value: string
    type: string
  }
  
  export interface Value {
    value: string
  }
  

export type Logs = {
    entityName: string
    label: string
    changeCount: number
    user: string
    logs: string[]
}
