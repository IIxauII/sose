<template>
  <ion-page>
    <default-header headerTitle="Map"></default-header>
    <ion-content fullscreen> </ion-content>
    <div
      style="width: 100%; height: 100%;"
      id="mapContainer"
      ref="hereMap"
    ></div>
  </ion-page>
</template>
<script>
import { IonPage, IonContent } from "@ionic/vue";
import DefaultHeader from "../components/global/DefaultHeader.vue";
import H from "@here/maps-api-for-javascript";
import { mapGetters } from 'vuex';

export default {
  name: "Map",
  components: {
    IonPage,
    IonContent,
    DefaultHeader,
  },
  data() {
    return {
      platform: null,
      apikey: "p1Ftvj6JG46SrSX95XIzaOfc29pemVIADKd9h8YTksw", // DO NOT PUSH THIS
      center: { lat: 40.73061, lng: -73.935242 },
      map: null,
      mapUi: H.ui.UI,
    };
  },
  computed: {
    ...mapGetters('geo', {
      getLocation: 'getLocation',
    }),
    ...mapGetters('citites', {
      getCities: 'getCities',
    }),
    ...mapGetters('partners', {
      // need to sort by nearest city of current view port and load partners accordingly
    })
  },
  watch: {
    getLocation(newValue, oldValue) {
      console.log('getLocation', newValue);
      if (newValue.lat !== 0) {
        this.center = newValue;
        this.updateCenter();
      }
    }
  },
  mounted() {
    setTimeout(() => {
      console.log('trying to add here map service now!');
      this.platform = new H.service.Platform({
        apikey: this.apikey,
      });
      this.initializeHereMap();
    }, 500);
  },
  methods: {
    initializeHereMap() {
      const mapContainer = this.$refs.hereMap;
      const mapTypes = this.platform.createDefaultLayers();

      this.map = new H.Map(mapContainer, mapTypes.vector.normal.map, {
        zoom: 15,
        center: this.center,
      });

      addEventListener("resize", () => {
        this.map.getViewPort().resize();
      });

      new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
      this.mapUi = H.ui.UI.createDefault(this.map, mapTypes);
      //this.$forceUpdate();
    },
    updateCenter() {
      if (this.mapUi) {
        // man i really need to start using typescript..
        this.mapUi.getMap().setCenter(this.center, true);
      }
    },
  },
};
</script>
<style>
#map {
  width: 60vw;
  min-width: 360px;
  text-align: center;
  margin: 5% auto;
  background-color: #ccc;
}
</style>
