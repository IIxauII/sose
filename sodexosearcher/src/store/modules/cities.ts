import { DebugService } from '@/services/debug';
import { DistanceService } from '@/services/distance';
import { SortService } from '@/services/sort'; 
import { StorageService } from '@/services/storage';
import { StorageKeys } from '@/model/enums/storage';
import { HTTP } from '@ionic-native/http';
import axios from 'axios';
import { LogLevel } from '@/model/enums/debug';

const distanceService = new DistanceService();
const sortService = new SortService();
const debugService = new DebugService();
const d1 = 'store.cities';
const storageService = new StorageService();

const state = () => ({
    cities: [],
});

const getters = {
    getCities(state: { cities: [] }){
        return state.cities;
    },
};

const actions = {
    async fetchCities({commit}: any) {
        await storageService.getItem(StorageKeys.CITIES).then((data) => {
            if (data) {
                debugService.logToDebug(LogLevel.INFO, d1, 'actions', `Fetched ${data.length} from ionic storage`);
                commit('saveCitiesWithoutUpdatingStorage', data);
                return;
            } else {
                debugService.logToDebug(LogLevel.ERROR, d1, 'actions', `Fetching cities from ionic storage failed!`);
                throw Error('data = undefined');
            }
        }).catch((err) => {
            debugService.logToDebug(LogLevel.ERROR, d1, 'actions', `Fetching cities from ionic storage failed with ${err}`);
            const apiEndpoint = process.env.VUE_APP_API_ENDPOINT + 'cities';

            // for ios & android
            HTTP.get(apiEndpoint, {}, {})
            .then((res) => {
                commit('sortCitiesAZ', res.data);
                debugService.logToDebug(LogLevel.SUCCESS, d1, 'actions', `Fetched cities HTTP with ${res.data.length} entries`);
            })
            .catch((err) => {
                debugService.logToDebug(LogLevel.ERROR, d1, 'actions', `Fetched cities HTTP failed with err: ${err}`);
                // if cordove not available, try to use axios (e.g. webbrowser enddevice)
                axios.get(apiEndpoint)
                .then((res) => {
                    debugService.logToDebug(LogLevel.SUCCESS, d1, 'actions', `Fetched cities AXIOS with ${res.data.length} entries`);
                    commit('sortCitiesAZ', res.data);
                })
                .catch((err) => {
                    debugService.logToDebug(LogLevel.ERROR, d1, 'actions', `Fetched cities AXIOS failed with err: ${err}`);
                });
            });
        });
    },
};

const mutations = {
    saveCitiesWithoutUpdatingStorage(state: { cities: any}, payload: any) {
        state.cities = payload;
        debugService.logToDebug(LogLevel.SUCCESS, d1, 'mutations.saveCitiesWithoutUpdatingStorage', `Executed`);
    },
    saveCities(state: { cities: any }, payload: any) {
        state.cities = payload;
        storageService.setItem(StorageKeys.CITIES, state.cities);
        debugService.logToDebug(LogLevel.SUCCESS, d1, 'mutations.saveCities', `Executed`);
    },
    sortCitiesAZ(state: { cities: any }, payload: any) {
        state.cities = sortService.sortByName(payload);
        storageService.setItem(StorageKeys.CITIES, state.cities);
        debugService.logToDebug(LogLevel.SUCCESS, d1, 'mutations.sortCitiesAZ', `Executed`);
    },
    sortCitiesGeo(state: { cities: any}, payload: { cities: any; location: {lat: number; lng: number}}) {
        const tempCities = payload.cities.map((city: any) => {
            const rawDistance: number = distanceService.calculateDistance({city, location: payload.location});
            return {...city, distance: distanceService.roundCityData(rawDistance)};
        });

        state.cities = sortService.sortByDistance(tempCities);
        storageService.setItem(StorageKeys.CITIES, state.cities);
        debugService.logToDebug(LogLevel.SUCCESS, d1, 'mutations.sortCitiesGeo', `Executed`);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}