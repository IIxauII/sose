export interface Partner {
    name: string;
    address: string;
    lat: number;
    lng: number;
    distance?: number;
}

export interface CityWithPartner {
    city: string;
    partners: Partner[];
}
export interface PartnersState {
    citiesWithPartners: CityWithPartner[];
    currentCity: string;
}

export type PartnersStateFunction = () => { citiesWithPartners: CityWithPartner[], currentCity: string };