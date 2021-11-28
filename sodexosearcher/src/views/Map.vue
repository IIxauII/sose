<template>
  <ion-page>
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    <link rel="stylesheet" type="text/css" href="https://js.api.here.com/v3/3.1/mapsjs-ui.css" />
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
import { mapGetters, mapActions, mapMutations } from 'vuex';
import hereConfig from '../../../configs/here.json';

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
      apikey: hereConfig.apiKey,
      center: { lat: 49.01094, lng: 8.40845 },
      map: null,
      mapUi: null,
      markerGroup: null,
    };
  },
  computed: {
    ...mapGetters('geo', {
      getLocation: 'getLocation',
    }),
    ...mapGetters('partners', {
      getNearPartners: 'getNearPartners',
    }),
  },
  watch: {
    getLocation(newValue, oldValue) {
      console.log('getLocation', newValue);
      if (newValue.lat !== 0) {
        setTimeout(() => {
          this.center = newValue;
          this.fetchNearPartners({
            ...newValue,
            maxDistance: 1,
          });
          this.updateCenter();
        }, 500)
      }
    },
    getNearPartners(newValue, oldValue) {
      console.log('getNearPartners', newValue);
      if (newValue) {
        setTimeout(() => {
          this.addPartnersToMap(newValue);
        }, 500);
      }
    }
  },
  mounted() {
    if (this.getLocation) {
      this.fetchNearPartners({
        ...this.getLocation,
        maxDistance: 5,
      });
    }
    setTimeout(() => {
      console.log('trying to add here map service now!');
      this.platform = new H.service.Platform({
        apikey: this.apikey,
      });
      this.initializeHereMap();
    }, 500);
  },
  methods: {
    ...mapActions('partners', {
      fetchNearPartners: 'fetchNearPartners',
    }),
    initializeHereMap() {
      const mapContainer = this.$refs.hereMap;
      const mapTypes = this.platform.createDefaultLayers();

      this.map = new H.Map(mapContainer, mapTypes.vector.normal.map, {
        zoom: 15,
        center: this.center,
      });

      addEventListener("resize", () => {
        console.log('resize triggered!');
        this.map.getViewPort().resize();
      });

      new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
      this.mapUi = H.ui.UI.createDefault(this.map, mapTypes);
    },
    updateCenter() {
      if (this.mapUi) {
        // man i really need to start using typescript..
        this.mapUi.getMap().setCenter(this.center, false);
      }
    },
    addPartnersToMap(nearPartners) {
      if (nearPartners) {
        if (!this.group) {
          this.group= new H.map.Group()
          this.map.addObject(this.group);
        }
        nearPartners.forEach((partner) => {
          const marker = new H.map.Marker({ lat: partner.lat, lng: partner.lng })
          /* const domMarker = new H.map.DomMarker(
            { lat: partner.lat, lng: partner.lng },
            { data: partner.name },
          ); */
          marker.setData(`<p>${partner.name}</p>`);
          marker.addEventListener('tap', (event) => {
            const bubbles = this.mapUi.getBubbles();
            if (bubbles && bubbles.length) {
              console.log(bubbles.length);
                bubbles.forEach((bubble) => {
                  this.mapUi.removeBubble(bubble);
              });
            }
            
            const bubble = new H.ui.InfoBubble(
                event.target.getGeometry(),
                {
                  content: event.target.getData(),
                }
            );
            this.mapUi.addBubble(bubble);
          }, false);
          this.group.addObject(marker);
        });
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
