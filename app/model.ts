export type Logs = {
    entityName: string;
    label: string;
    changeCount: number;
    dateTime: string;
    user: string;
    logs: string[];
  };
  
  export type LogHeader = {
    pageSize: number;
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
  
  export type AuditLogInResponse = {
    propertyCode: string;
    headers: LogHeader;
    logs: Logs[];
  };
  
  export type AuditCommitByFilter = {
    pageInfo: PageInfo;
    nodes: Node[];
  };
  
  export type PageInfo = PageInfoNoHeader & LogHeader;
  export type PageInfoNoHeader = {
    cursor: string;
    continuationQuery: string;
  };

  export type GraphResponse = {
    data: Data
}
export type Data = {
    auditCommitByFilter: AuditCommitByFilter
}

export type Node = {
    type: string;
    id: string;
    label: string;
    user: string;
    timestamp: string;
    transaction: string;
    changes?: Change[];
    events?: Event[];
  };

  export type Change = {
    path: Path[];
    type: string;
    from?: From[];
    to?: To[];
    collection: boolean;
  };
  export type Path = {
    value: string;
    type: string;
  };
  
  export type From = {
    value: string;
    references?: References;
  };
  
  export type References = {
    type: string;
    id: string;
  };
  
  export type To = {
    value: string;
    references?: References;
  };

  
export type ChangeGroup = {
    pathvalue: string;
    lineValue: string;
    type: string;
    from: string | undefined;
    to: string | undefined;
    path: Path[];
};
export type Event = {
    name: string;
    attributes?: Attribute[];
};

export type Attribute = {
    path: Path[];
    values: Value[];
    collection: boolean;
};

export type Value = {
    value: string;
};