import { HTTP } from '@ionic-native/http';
import axios from 'axios';
import { GeoSpot, NearGeoSpot } from '@/model/geo';
import {
    CityWithPartner,
    CityWithPartnerWithDistance,
    Partner,
    PartnersGeoPayload,
    PartnersState,
    PartnersStateFunction,
    PartnerWithDistance,
} from '@/model/partners';
import { DistanceService } from '@/services/distance';
import { SortService } from '@/services/sort';
import { DebugService } from '@/services/debug';
import { StorageService } from '@/services/storage';
import { StorageKeys } from '@/model/enums/storage';
import { LogLevel } from '@/model/enums/debug';

const sortService = new SortService();
const distanceService = new DistanceService();
const debugService = new DebugService();
const d1 = 'store.cities';
const storageService = new StorageService();

const state: PartnersStateFunction = () => ({
    citiesWithPartners: [],
    currentCity: '',
    nearPartners: [],
});

const getters = {
    getAllPartners(state: PartnersState): CityWithPartner[] {
        return state.citiesWithPartners;
    },
    getPartnersOfCurrentCity(state: PartnersState): CityWithPartner | undefined {
        return state.citiesWithPartners.find((city: CityWithPartner) => city.name === state.currentCity);
    },
    getNearPartners(state: PartnersState): Partner[] {
        return state.nearPartners;
    }
};

const actions = {
    async fetchCityWithPartners({ commit }: any, payload: string) {
        await storageService
            .getItem(StorageKeys.CITIESWITHPARTNERS)
            .then((data) => {
                if (data) {
                    const currentCityWithPartners: CityWithPartner = data.find((city: CityWithPartner) => city.name === payload);
                    if (currentCityWithPartners) {
                        debugService.logToDebug(
                            LogLevel.INFO,
                            d1,
                            'actions',
                            `Fetched ${currentCityWithPartners.sodexoPartners.length} partners for ${payload} from ionic storage`
                        );
                        commit('saveCitiesWithPartnersWithoutUpdatingStorage', data);
                        return;
                    } else {
                        debugService.logToDebug(
                            LogLevel.INFO,
                            d1,
                            'actions',
                            `Fetched ${data.length} cities with partners from ionic storage, but not ${payload}`
                        );
                        commit('saveCitiesWithPartnersWithoutUpdatingStorage', data);
                        throw Error(`${payload} - not found in ionic/storage`);
                    }
                }
                debugService.logToDebug(LogLevel.ERROR, d1, 'actions', `Fetching partners for ${payload} from ionic storage failed`);
                throw Error(`${payload} - not found`);
            })
            .catch((err) => {
                debugService.logToDebug(LogLevel.ERROR, d1, 'actions', `Fetching partners from ionic storage failed with: ${err}`);

                const apiEndpoint = process.env.VUE_APP_API_ENDPOINT + 'cities/' + payload;

                // for ios & android
                HTTP.get(apiEndpoint, {}, {})
                    .then((res) => {
                        const dataToSave: CityWithPartner = res.data;
                        debugService.logToDebug(
                            LogLevel.SUCCESS,
                            d1,
                            'actions',
                            `Fetched ${dataToSave.name} partners HTTP with ${dataToSave.sodexoPartners.length} entries`
                        );
                        commit('sortPartnersAZ', dataToSave);
                    })
                    .catch((err) => {
                        debugService.logToDebug(LogLevel.ERROR, d1, 'actions', `Fetched partners HTTP failed with err: ${err}`);

                        // if cordove not available, try to use axios (e.g. webbrowser enddevice)
                        axios
                            .get(apiEndpoint)
                            .then((res) => {
                                const dataToSave: CityWithPartner = res.data;
                                debugService.logToDebug(
                                    LogLevel.SUCCESS,
                                    d1,
                                    'actions',
                                    `Fetched ${dataToSave.name} partners AXIOS with ${dataToSave.sodexoPartners.length} entries`
                                );
                                commit('sortPartnersAZ', dataToSave);
                            })
                            .catch((err) => {
                                debugService.logToDebug(LogLevel.ERROR, d1, 'actions', `Fetched partners AXIOS failed with err: ${err}`);
                            });
                    });
            });
    },
    async fetchNearPartners({ commit }: any, payload: NearGeoSpot) {
        const requestQuery = `?lat=${payload.lat}&lng=${payload.lng}&maxDistance=${payload.maxDistance}`;
        const apiEndpoint = process.env.VUE_APP_API_ENDPOINT + 'partners/nearest' + requestQuery;

        // for ios & android
        HTTP.get(apiEndpoint, {}, {})
            .then((res) => {
                console.log(res);
                commit('saveNearPartners', res.data);
            })
            .catch((err) => {
                console.log(err);

                // if cordove not available, try to use axios (e.g. webbrowser enddevice)
                axios
                    .get(apiEndpoint)
                    .then((res) => {
                       console.log(res);
                       commit('saveNearPartners', res.data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
    }
};

const mutations = {
    saveNearPartners(state: PartnersState, payload: Partner[]) {
        state.nearPartners = payload;
    },
    setCurrentCity(state: PartnersState, payload: string) {
        state.currentCity = payload;
        debugService.logToDebug(LogLevel.SUCCESS, d1, 'mutations.setCurrentCity', 'Executed');
    },
    saveCitiesWithPartnersWithoutUpdatingStorage(state: PartnersState, payload: CityWithPartner[]) {
        state.citiesWithPartners = payload;
        debugService.logToDebug(LogLevel.SUCCESS, d1, 'mutations.saveCitiesWithPartnersWithoutUpdatingStorage', 'Executed');
    },
    saveCityWithPartners(state: PartnersState, payload: CityWithPartner) {
        state.citiesWithPartners.push(payload);
        storageService.setItem(StorageKeys.CITIESWITHPARTNERS, state.citiesWithPartners);
        debugService.logToDebug(LogLevel.SUCCESS, d1, 'mutations.saveCityWithPartners', 'Executed');
    },
    sortPartnersAZ(state: PartnersState, payload: CityWithPartner) {
        const sortedCityWithPartner: CityWithPartner = {
            ...payload,
            sodexoPartners: sortService.sortByName(payload.sodexoPartners) as Partner[],
        };
        const currentIndex = state.citiesWithPartners.indexOf(payload);

        if (currentIndex != -1) {
            state.citiesWithPartners[currentIndex] = sortedCityWithPartner;
        } else {
            state.citiesWithPartners.push(sortedCityWithPartner);
        }
        storageService.setItem(StorageKeys.CITIESWITHPARTNERS, state.citiesWithPartners);
        debugService.logToDebug(LogLevel.SUCCESS, d1, 'mutations.sortPartnersAZ', 'Executed');
    },
    sortPartnersGeo(state: PartnersState, payload: PartnersGeoPayload) {
        const tempCity: CityWithPartnerWithDistance = {
            ...payload.cityWithPartners,
            sodexoPartners: payload.cityWithPartners.sodexoPartners.map((partner: Partner) => {
                const rawDistance: number = distanceService.calculateDistance({ otherLocation: partner as GeoSpot, myLocation: payload.location });
                return { ...partner, distance: distanceService.roundCityData(rawDistance) };
            }),
        };

        const currentIndex = state.citiesWithPartners.indexOf(payload.cityWithPartners);

        const sortedByGeoCityWithPartner: CityWithPartner = {
            ...tempCity,
            sodexoPartners: sortService.sortByDistance(tempCity.sodexoPartners) as PartnerWithDistance[],
        };

        if (currentIndex != -1) {
            state.citiesWithPartners[currentIndex] = sortedByGeoCityWithPartner;
        } else {
            state.citiesWithPartners.push(sortedByGeoCityWithPartner);
        }
        storageService.setItem(StorageKeys.CITIESWITHPARTNERS, state.citiesWithPartners);
        debugService.logToDebug(LogLevel.SUCCESS, d1, 'mutations.sortPartnersGeo', 'Executed');
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
