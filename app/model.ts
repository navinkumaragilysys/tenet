export type GraphResponse = {
	data: Data;
};
export type Root = {
	data: Data;
};

export type Data = {
	auditCommitByFilter: AuditCommitByFilter;
};

export type AuditCommitByFilter = {
	pageInfo: PageInfo;
	nodes: Node[];
};

export type PageInfo = {
	cursor: string;
	pageSize: number;
	currentPage: number;
	totalPages: number;
	totalCount: number;
};

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
	references?: References2;
};

export type References2 = {
	type: string;
	id: string;
};

export type Event = {
	name: string;
	attributes?: Attribute[];
};

export type Attribute = {
	path: Path2[];
	values: Value[];
	collection: boolean;
};

export type Path2 = {
	value: string;
	type: string;
};

export type Value = {
	value: string;
};

export type Logs = {
	entityName: string;
	label: string;
	changeCount: number;
	user: string;
	logs: string[];
};

export type ChangeGroup = {
	pathvalue: string;
	lineValue: string;
	type: string;
	from: string;
	to: string;
};
