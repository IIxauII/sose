<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
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
        getCities: this.getCities,
        getLocation: this.getLocation,
      };
    },
  },
  watch: {
    geoAndCities(newValue, oldValue) {
      console.log('newValue', newValue);
      console.log('oldValue', oldValue);
      if (newValue.getCities.length && newValue.getLocation.lat !== 0) {
        console.log('we can do geoCalculation');
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
  },
});
</script>