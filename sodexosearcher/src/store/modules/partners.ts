import { GeoSpot } from "@/model/geo";
import { CityWithPartner, Partner, PartnersGeoPayload, PartnersState, PartnersStateFunction } from "@/model/partners";
import { DistanceService } from "@/services/distance";
import { SortService } from "@/services/sort";

const sortService = new SortService();
const distanceService = new DistanceService();

const state: PartnersStateFunction = () => ({
    citiesWithPartners: [],
    currentCity: '',
});

const getters = {
    getAllPartners(state: PartnersState) {
        return state.citiesWithPartners;
    },
    getPartnersOfCurrentCity(state: PartnersState) {
        return state.citiesWithPartners.find((city: CityWithPartner) => city.name = state.currentCity);
    },
};

const actions = {};

const mutations = {
    saveCitiesWithPartnersWithoutUpdatingStorage(state: PartnersState, payload: CityWithPartner[]) {
        state.citiesWithPartners = payload;
    },
    saveCityWithPartners(state: PartnersState, payload: CityWithPartner) {
        state.citiesWithPartners.push(payload);
    },
    sortPartnersAZ(state: PartnersState, payload: CityWithPartner) {
        const sortedCityWithPartner: CityWithPartner = {
            name: payload.name,
            partners: sortService.sortByName(payload.partners) as Partner[],
        };
        const currentIndex = state.citiesWithPartners.indexOf(payload);
        console.log('sortPartnersAZ - payload', payload);
        console.log('sortPartnersAZ - sorted', sortedCityWithPartner);
        console.log('sortPartnersAZ - currentIndex', currentIndex);
        if (currentIndex != -1) {
            state.citiesWithPartners[currentIndex] = sortedCityWithPartner;
        } else {
            state.citiesWithPartners.push(sortedCityWithPartner);
        }
        console.log('sortPartnersAZ - state', state.citiesWithPartners);
    },
    sortPartnersGeo(state: PartnersState, payload: PartnersGeoPayload) {
        const tempCity: CityWithPartner = {
            name: payload.cityWithPartners.name,
            partners: payload.cityWithPartners.partners.map((partner: Partner) => {
                const rawDistance: number = distanceService.calculateDistance({ otherLocation: partner as GeoSpot, myLocation: payload.location});
                return {...partner, distance: distanceService.roundCityData(rawDistance)};
            }),
        };

        const currentIndex = state.citiesWithPartners.indexOf(payload.cityWithPartners);

        const sortedByGeoCityWithPartner: CityWithPartner = {
            name: tempCity.name,
            partners: sortService.sortByDistance(tempCity.partners) as Partner[],
        };

        if (currentIndex != -1) {
            state.citiesWithPartners[currentIndex] = sortedByGeoCityWithPartner;
        } else {
            state.citiesWithPartners.push(sortedByGeoCityWithPartner);
        }
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}