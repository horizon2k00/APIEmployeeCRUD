import { Request, Response, NextFunction } from "express";

export { Request, Response, NextFunction };

export interface employee {
	[index: string]: number | string;
	empId: number;
	name: string;
	position: string;
	department: string;
	salary: number;
	email: string;
	password: string;
	age: number;
	privilege: string;
	joinDate: string;
	rating: number;
}
export interface changeLog {
	empId: number;
	createdAt: number;
	before: {
		[index: string]: string | number;
	};
	after: {
		[index: string]: string | number;
	};
	id: number;
	updatedAt: number;
}
export interface Payload {
	privilege: string;
	email: string;
}
export interface Req extends Request {
	jwtPayload: Payload;
}
export interface Res extends Response {
	employees: employee[];
	id: number;
	index: number;
	updateRoute: boolean;
}
export type numberKey = "salary" | "empId" | "age" | "rating";

export interface empHist {
	empId: number;
	name: string;
	position: string;
	department: string;
	salary: number;
	email: string;
	password: string;
	age: number;
	privilege: string;
	joinDate: string;
	rating: number;
	history?: {}[];
}