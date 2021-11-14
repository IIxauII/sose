import { DebugService } from '@/services/debug';
import { DistanceService } from '@/services/distance';
import { SortService } from '@/services/sort'; 
import { HTTP } from '@ionic-native/http';
import axios from 'axios';

const distanceService = new DistanceService();
const sortService = new SortService();
const debugService = new DebugService();

const state = () => ({
    cities:[],
});

const getters = {
    getCities(state: { cities: [] }){
        return state.cities;
    },
};

const actions = {
    async fetchCities({commit}: any) {
        const apiEndpoint = process.env.VUE_APP_API_ENDPOINT + 'cities';

        // for ios & android
        HTTP.get(apiEndpoint, {}, {})
        .then((res) => {
            commit('sortCitiesAZ', res.data);
            debugService.logToDebug(`Fetched cities HTTP with ${res.data.length} entries`);
        })
        .catch((err) => {
            debugService.logToDebug(err);
            // if cordove not available, try to use axios (e.g. webbrowser enddevice)
            axios.get(apiEndpoint)
            .then((res) => {
                debugService.logToDebug(`Fetched cities AXIOS with ${res.data.length} entries`);
                commit('sortCitiesAZ', res.data);
            })
            .catch((err) => {
                debugService.logToDebug(err);
            })
        })
    },
};

const mutations = {
    saveCities(state: { cities: any }, payload: any) {
        state.cities = payload;
        debugService.logToDebug('Executed cities.saveCities');
    },
    sortCitiesAZ(state: { cities: any }, payload: any) {
        state.cities = sortService.sortByName(payload);
        debugService.logToDebug('Executed cities.sortCitiesAZ');
    },
    sortCitiesGeo(state: { cities: any}, payload: { cities: any; location: {lat: number; lng: number}}) {
        const tempCities = payload.cities.map((city: any) => {
            const rawDistance: number = distanceService.calculateDistance({city, location: payload.location});
            return {...city, distance: distanceService.roundCityData(rawDistance)};
        });

        state.cities = sortService.sortByDistance(tempCities);
        debugService.logToDebug('Executed cities.sortCitiesGeo');
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}