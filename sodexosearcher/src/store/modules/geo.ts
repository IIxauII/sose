import { Geolocation } from '@ionic-native/geolocation';
import { DebugService } from '@/services/debug';
import { StorageService } from '@/services/storage';
import { StorageKeys } from '@/model/enums/storage';
import { LogLevel } from '@/model/enums/debug';

const debugService = new DebugService();
const storageService = new StorageService();
interface Location {
    lat: number;
    lng: number;
}

interface StateLocation {
    location: Location;
}

const state = () => ({
    location: {
        lat: 0,
        lng: 0
    },
});

const getters = {
    getLocation(state: StateLocation) {
        return state.location;
    },
};

const actions = {
    async fetchLocation({commit}: any) {
        await storageService.getItem(StorageKeys.GEO).then((data) => {
            if (data) {
                debugService.logToDebug(LogLevel.INFO, 'store.geo', 'actions.fetchLocation', `Fetched ${data} from ionic storage`);
                commit('saveLocationWithoutUpdatingStorage', data);
            } else {
                debugService.logToDebug(LogLevel.WARNING, 'store.geo', 'actions.fetchLocation', 'Fetching data from ionic storage failed');
                throw Error('geo data = undefined');
            }
        }).catch((err) => {
            debugService.logToDebug(LogLevel.WARNING, 'store.geo', 'actions.fetchLocation', `Fetching data from ionic storage failed with ${err}`);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    if (pos.coords) {
                        commit('saveLocation', {lat: pos.coords.latitude, lng: pos.coords.longitude});
                    } else {
                        commit('debug/pushDebug', `Fetching position via navigator failed!`, { root: true});
                    }
                });
            } else {
                // unsure if this will work 
                // for ios some changes need to be made
                // https://ionicframework.com/docs/native/geolocation
                Geolocation.getCurrentPosition().then((res) => {
                    console.log('GeolocationResult', res);
                }).catch((err) => {
                    console.log('GeolocationError', err);
                    commit('debug/pushDebug', `Fetching position via Geolocation failed!`, { root: true});
                });
            }
        })
    }
};

const mutations = {
    saveLocationWithoutUpdatingStorage(state: StateLocation, payload: Location) {
        state.location = payload;
        //debugService.logToDebug(`[store.geo][mutations.saveLocationWithoutUpdatingStorage] - Executed`);
        debugService.logToDebug(LogLevel.SUCCESS, 'store.geo', 'mutations.saveLocationWithoutUpdatingStorage', 'Executed');
    },
    saveLocation(state: StateLocation, payload: Location) {
        state.location = payload;
        storageService.setItem(StorageKeys.GEO, state.location);
        debugService.logToDebug(LogLevel.SUCCESS, 'store.geo', 'mutations.saveLocation', 'Executed');
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}