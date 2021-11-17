import { CityWithPartner, PartnersState, PartnersStateFunction } from "@/model/partners";

const state: PartnersStateFunction = () => ({
    citiesWithPartners: [],
    currentCity: '',
});

const getters = {
    getAllPartners(state: PartnersState) {
        return state.citiesWithPartners;
    },
    getPartnersOfCurrentCity(state: PartnersState) {
        return state.citiesWithPartners.find((city: CityWithPartner) => city.city = state.currentCity);
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
        state.citiesWithPartners.forEach((cityWithPartner: CityWithPartner) => {
            //TODO
        })
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}