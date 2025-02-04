import { Route, RouteLocation } from "Types/routeTypes";

export const formatRoutes = (routes: Route[]): Route[] => {
    return routes.map((route): Route => {
        let startLocation: RouteLocation = { address: "" };
        let endLocation: RouteLocation = { address: "" };

        if (!route.id) {
            console.warn("Rota inválida encontrada:", route);
            return route;
        }

        if (typeof route.startLocation === "string") {
            try {
                startLocation = JSON.parse(route.startLocation);
            } catch (e) {
                startLocation = {
                    address: route.startLocation,
                };
            }
        } else if (route.startLocation && typeof route.startLocation === "object") {
            startLocation = {
                address: route.startLocation.address || "",
            };
        }

        if (typeof route.endLocation === "string") {
            try {
                endLocation = JSON.parse(route.endLocation);
            } catch (e) {
                endLocation = { address: route.endLocation };
            }
        } else if (route.endLocation && typeof route.endLocation === "object") {
            endLocation = {
                address: route.endLocation.address || "",
            };
        }

        return {
            ...route,
            id: route.id,
            distance: route.distance || 0,
            estimatedDuration: route.estimatedDuration || 0,
            status: route.status || "Pendente",
            startLocation: startLocation,
            endLocation: endLocation,
        };
    });
};
