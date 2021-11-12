import { createStore } from 'vuex';

import debugModule from './modules/debug';
import citiesModule from './modules/cities';
import geoModule from './modules/geo';

const store = createStore({
    modules: {
        cities: citiesModule,
        debug: debugModule,
        geo: geoModule,
    },
});

export default store;