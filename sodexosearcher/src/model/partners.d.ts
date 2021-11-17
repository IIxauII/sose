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
    sodexo_partners: Partner[];
    here_id: string;
    lat: number;
    lng: number;
}

export interface PartnerWithDistance extends Partner {
    distance: number;
}

export interface CityWithPartnerWithDistance extends CityWithPartner {
    sodexo_partners: PartnerWithDistance[];
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