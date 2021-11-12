import { Geolocation } from '@ionic-native/geolocation';

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
    fetchLocation({commit}: any) {
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
    }
};

const mutations = {
    saveLocation(state: StateLocation, payload: Location) {
        state.location = payload;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}