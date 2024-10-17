import BaseService from "./BaseServices";
import Route from "../Models/Route";

class RouteService extends BaseService<Route> {

    getPendingRoutes(): Route[] {
        return this.items.filter(route => route.status === 'pending')
    }

    getInProgressRoutes(): Route[] {
        return this.items.filter(route => route.status === 'inProgress')
    }

    startRoute(id: string): Route | undefined {
        const route = this.getById(id);
        if (route && route.status === 'pending') {
            route.start();
            return route;
        }
        return undefined;
    }
    completeRoute(id: string): Route | undefined {
        const route = this.getById(id);
        if (route && route.status === 'inProgress') {
            route.complete();
            return route;
        }
        return undefined
    }

    cancelRoute(id: string): Route | undefined {
        const route = this.getById(id);
        if (route && route.status === 'pending') {
            route.cancel();
            return route;
        }
        return undefined
    }

}

export default new RouteService();