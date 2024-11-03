export interface RouteDetails {
    distance: string;
    duration: string;
}

export interface Coordinates {
    lat: number;
    lon: number;
}

export interface OSRMResponse {
    code: string;
    routes?: Array<{
        distance: number;
        duration: number;
    }>;
    message?: string;
}