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
        zoom: 17,
        center: this.center,
      });
      console.log('this.map', this.map);

      addEventListener("resize", () => {
        console.log('resize triggered!');
        this.map.getViewPort().resize();
      });

      this.map.addEventListener('mapviewchangeend', () => {
        console.log('mapviewchangeend triggered!');
        const center = this.map.getCenter();
        const zoomLevel = this.map.getZoom();
        //const minZoomLevel = 2;
        //const maxZoomlevel = 22;
        //need to work out a formula for this below
        let maxDistance = 0;
        if (zoomLevel <= 8) {
          maxDistance = 100;
        } else if (zoomLevel <= 10) {
          maxDistance = 50;
        } else if (zoomLevel <= 12) {
          maxDistance = 10
        } else if(zoomLevel <= 14) {
          maxDistance = 3;
        } else if(zoomLevel <= 16) {
          maxDistance = 2;
        } else if (zoomLevel <= 18) {
          maxDistance = 1;
        }
        console.log('center', center);
        console.log('zoomLevel', zoomLevel);
        console.log('maxDistance', maxDistance);
        this.fetchNearPartners({
          lat: center.lat,
          lng: center.lng,
          maxDistance,
        });
      });

      new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
      this.mapUi = H.ui.UI.createDefault(this.map, mapTypes);

      if (this.getLocation) {
        console.log(this.getLocation);
      }
    },
    updateCenter() {
      if (this.mapUi) {
        // man i really need to start using typescript..
        this.mapUi.getMap().setCenter(this.center, false);
      }
    },
    addPartnersToMap(nearPartners) {
      console.log('addingPartnersToMap');
      if (nearPartners) {
        if (this.group) {
          this.map.removeObject(this.group);
        } 
        this.group= new H.map.Group();
        this.map.addObject(this.group);
        nearPartners.forEach((partner) => {
          const marker = new H.map.Marker({ lat: partner.lat, lng: partner.lng });
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
