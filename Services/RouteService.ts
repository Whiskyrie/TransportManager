import BaseService from "./BaseServices";
import Route from "../Models/Route";

class RouteService extends BaseService<Route> {

    getPendingRoutes(): Route[] {
        return this.items.filter(route => route.status === 'Pendente')
    }

    getInProgressRoutes(): Route[] {
        return this.items.filter(route => route.status === 'Em Progresso')
    }

    startRoute(id: string): Route | undefined {
        const route = this.getById(id);
        if (route && route.status === 'Pendente') {
            route.start();
            return route;
        }
        return undefined;
    }
    completeRoute(id: string): Route | undefined {
        const route = this.getById(id);
        if (route && route.status === 'Em Progresso') {
            route.complete();
            return route;
        }
        return undefined
    }

    cancelRoute(id: string): Route | undefined {
        const route = this.getById(id);
        if (route && route.status === 'Pendente') {
            route.cancel();
            return route;
        }
        return undefined
    }

}

export default new RouteService();