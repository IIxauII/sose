export interface GeoSpot {
    lat: number;
    lng: number;
}

export interface NearGeoSpot extends GeoSpot {
    maxDistance: number;
}