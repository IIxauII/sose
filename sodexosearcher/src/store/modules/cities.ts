import { HTTP } from '@ionic-native/http';
import axios from 'axios';

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
            commit('debug/pushDebug', `Fetched cities HTTP with ${res.data.length} entries`, { root: true});
        })
        .catch((err) => {
            //console.error(err);
            commit('debug/pushDebug', err, { root: true});
            // if cordove not available, try to use axios (e.g. webbrowser enddevice)
            axios.get(apiEndpoint)
            .then((res) => {
                commit('sortCitiesAZ', res.data);
                commit('debug/pushDebug', `Fetched cities AXIOS with ${res.data.length} entries`, { root: true});
            })
            .catch((err) => {
                //console.error(err);
                commit('debug/pushDebug', err, { root: true});
            })
        })
    },
};

const mutations = {
    saveCities(state: { cities: any }, payload: any) {
        state.cities = payload;
    },
    sortCitiesAZ(state: { cities: any }, payload: any) {
        state.cities = payload.sort((a: any, b: any) => a.name.localeCompare(b.name));
    },
    sortCitiesGeo(state: { cities: any}, payload: { cities: any; location: {lat: number; lng: number}}) {
        function calcDistance(city: any) {
            const lat2 = city.lat;
            const lng2 = city.lng;
            const p = 0.017453292519943295;    // Math.PI / 180
            const c = Math.cos;
            const a = 0.5 - c((lat2 - payload.location.lat) * p)/2 + 
                    c(payload.location.lat * p) * c(lat2 * p) * 
                    (1 - c((lng2 - payload.location.lng) * p))/2;
      
            return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
        }

        state.cities = payload.cities.map((city: any) => {
            const rawDistance = calcDistance(city);
            if (rawDistance > 2) {
               return {...city, distance: Math.round(rawDistance)};
            } else {
               return {...city, distance: Math.round(rawDistance * 10) / 10};
            }
        }).sort((a: any, b: any) => a.distance - b.distance);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}