<template>
  <ion-app>
    <sose-menu></sose-menu>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import SoseMenu from './components/Menu.vue';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
    SoseMenu,
  },
  data() {
    return {
      savedGeoAndCities: false,
      savedGeoAndPartnersOfCurrentCity: false,
    }
  },
  computed: {
    ...mapGetters('cities', {
      getCities: 'getCities',
    }),
    ...mapGetters('partners', {
      getPartnersOfCurrentCity: 'getPartnersOfCurrentCity',
    }),
    ...mapGetters('geo', {
      getLocation: 'getLocation',
    }),
    geoAndCities() {
      return {
        cities: this.getCities,
        location: this.getLocation,
      };
    },
    geoAndPartnersOfCurrentCity() {
      return {
        cityWithPartners: this.getPartnersOfCurrentCity,
        location: this.getLocation,
      }
    }
  },
  watch: {
    geoAndCities(newValue, oldValue) {
      if (this.savedGeoAndCities) {
        return;
      } else if (newValue.cities && newValue.cities.length && newValue.location && newValue.location.lat !== 0) {
        this.sortCitiesGeo(newValue);
        this.savedGeoAndCities = true;
      }
    },
    geoAndPartnersOfCurrentCity(newValue, oldValue) {
      if (this.savedGeoAndPartnersOfCurrentCity) {
        return;
      } else if (newValue.cityWithPartners && newValue.cityWithPartners.sodexoPartners.length && newValue.location && newValue.location.lat !== 0) {
        this.sortPartnersGeo(newValue);
        this.savedGeoAndPartnersOfCurrentCity = true;
      }
    },
  },
  mounted() {
    // retrieving geo data
    this.fetchLocation();
    // fetching sodexo city data
    this.fetchCities();
  },
  methods: {
    ...mapActions('cities', {
      fetchCities: 'fetchCities',
    }),
    ...mapActions('geo', {
      fetchLocation: 'fetchLocation',
    }),
    ...mapMutations('cities', {
      sortCitiesGeo: 'sortCitiesGeo',
    }),
    ...mapMutations('partners', {
      sortPartnersGeo: 'sortPartnersGeo',
    }),
  },
});
</script>