import { GeoSpot } from '@/model/geo';

export interface Partner {
    name: string;
    address: string;
    lat: number;
    lng: number;
}

export interface CityWithPartner {
    name: string;
    post_code: number;
    sodexoPartners: Partner[];
    here_id: string;
    lat: number;
    lng: number;
}

export interface PartnerWithDistance extends Partner {
    distance: number;
}

export interface CityWithPartnerWithDistance extends CityWithPartner {
    sodexoPartners: PartnerWithDistance[];
}

export interface PartnersState {
    citiesWithPartners: CityWithPartner[];
    currentCity: string;
    nearPartners: Partner[];
    mapAllPartners: Partner[];
}

export interface PartnersGeoPayload {
    cityWithPartners: CityWithPartner;
    location: GeoSpot;
}

export type PartnersStateFunction = () => { citiesWithPartners: CityWithPartner[], currentCity: string, nearPartners: Partner[]};