<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  data() {
    return {
      savedGeoAndCities: false,
    }
  },
  computed: {
    ...mapGetters('cities', {
      getCities: 'getCities',
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
  },
  watch: {
    geoAndCities(newValue, oldValue) {
      console.log('newValue', newValue);
      console.log('oldValue', oldValue);
      console.log('savedGeoAndCities', this.savedGeoAndCities);
      if (this.savedGeoAndCities) {
        console.log('Already saved!', this.savedGeoAndCities);
        return;
      } else if (newValue.cities && newValue.cities.length && newValue.location && newValue.location.lat !== 0) {
        console.log('we can do geoCalculation');
        this.sortCitiesGeo(newValue);
        this.savedGeoAndCities = true;
      } else {
        console.log('else');
        console.log(newValue.cities ? true : false);
        console.log(newValue.cities.length ? true : false);
        console.log(newValue.location ? true: false);
        console.log(newValue.location.lat !== 0 ? true : false);
        console.log((newValue.cities && newValue.cities.length && newValue.location && newValue.location.lat !== 0) ? true : false);
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
  },
});
</script>