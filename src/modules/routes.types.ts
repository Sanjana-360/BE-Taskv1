import { Router } from "express";

export interface IRoute {
    path: string;
    router: Router;
    middleware?: any[]
}

export interface IRoutes {
    allRoutes: IRoute[];
    init?: any;
}