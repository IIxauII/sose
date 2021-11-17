import { HTTP } from '@ionic-native/http';
import axios from 'axios';
import { GeoSpot } from "@/model/geo";
import { CityWithPartner, CityWithPartnerWithDistance, Partner, PartnersGeoPayload, PartnersState, PartnersStateFunction, PartnerWithDistance } from "@/model/partners";
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

const actions = {
    async fetchCityWithPartners({ commit }: any, payload: string) {
        const apiEndpoint = process.env.VUE_APP_API_ENDPOINT + 'cities/' + payload;

        // for ios & android
        HTTP.get(apiEndpoint, {}, {})
            .then((res) => {
                console.log('cordova http');
                console.log(res);
                const dataToSave: CityWithPartner = {
                    ...res.data[0],
                    // eslint-disable-next-line
                    sodexo_partners: JSON.parse(res.data[0].sodexo_partners),
                };
                commit('saveCityWithPartners', dataToSave);
            })
            .catch((err) => {
                console.log(err);
                console.log(err.status);

                // if cordove not available, try to use axios (e.g. webbrowser enddevice)
                axios.get(apiEndpoint)
                    .then((res) => {
                        console.log('axios http');
                        console.log(res);
                        const dataToSave: CityWithPartner = {
                            ...res.data[0],
                            // eslint-disable-next-line
                            sodexo_partners: JSON.parse(res.data[0].sodexo_partners),
                        };
                        commit('saveCityWithPartners', dataToSave);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            })
    }
};

const mutations = {
    setCurrentCity(state: PartnersState, payload: string) {
        state.currentCity = payload;
    },
    saveCitiesWithPartnersWithoutUpdatingStorage(state: PartnersState, payload: CityWithPartner[]) {
        state.citiesWithPartners = payload;
    },
    saveCityWithPartners(state: PartnersState, payload: CityWithPartner) {
        state.citiesWithPartners.push(payload);
        console.log('state.citiesWithpartners', state.citiesWithPartners);
    },
    sortPartnersAZ(state: PartnersState, payload: CityWithPartner) {
        const sortedCityWithPartner: CityWithPartner = {
            ...payload,
            // eslint-disable-next-line
            sodexo_partners: sortService.sortByName(payload.sodexo_partners) as Partner[],
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
        const tempCity: CityWithPartnerWithDistance = {
            ...payload.cityWithPartners,
            // eslint-disable-next-line
            sodexo_partners: payload.cityWithPartners.sodexo_partners.map((partner: Partner) => {
                const rawDistance: number = distanceService.calculateDistance({ otherLocation: partner as GeoSpot, myLocation: payload.location });
                return { ...partner, distance: distanceService.roundCityData(rawDistance) };
            }),
        };

        const currentIndex = state.citiesWithPartners.indexOf(payload.cityWithPartners);

        const sortedByGeoCityWithPartner: CityWithPartner = {
            ...tempCity,
            // eslint-disable-next-line
            sodexo_partners: sortService.sortByDistance(tempCity.sodexo_partners) as PartnerWithDistance[],
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