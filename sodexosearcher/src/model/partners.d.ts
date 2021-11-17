import { GeoSpot } from '@/model/geo';

export interface Partner {
    name: string;
    address: string;
    lat: number;
    lng: number;
    distance?: number;
}

export interface CityWithPartner {
    name: string;
    partners: Partner[];
}

export interface PartnersState {
    citiesWithPartners: CityWithPartner[];
    currentCity: string;
}

export interface PartnersGeoPayload {
    cityWithPartners: CityWithPartner;
    location: GeoSpot;
}

export type PartnersStateFunction = () => { citiesWithPartners: CityWithPartner[], currentCity: string };