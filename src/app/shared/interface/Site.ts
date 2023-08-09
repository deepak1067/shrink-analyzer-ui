export interface Site {
    code: string;
    name: string;
    timezone: string;
    'geo-location': {
        hierarchy: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
    };
    labels: string[];
    'exit-doors': {
        id: number;
        name: string;
    }[];
}
