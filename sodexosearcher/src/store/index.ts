import { createStore } from 'vuex';

import debugModule from './modules/debug';
import citiesModule from './modules/cities';
import partnersModule from './modules/partners';
import geoModule from './modules/geo';

const store = createStore({
    modules: {
        cities: citiesModule,
        debug: debugModule,
        partners: partnersModule,
        geo: geoModule,
    },
});

export default store;