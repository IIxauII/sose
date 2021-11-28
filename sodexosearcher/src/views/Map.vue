<template>
  <ion-page>
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    <link rel="stylesheet" type="text/css" href="https://js.api.here.com/v3/3.1/mapsjs-ui.css" />
    <default-header headerTitle="Map"></default-header>
    <ion-content fullscreen> </ion-content>
    <div style="width: 100%; height: 100%;" id="mapContainer" ref="hereMap"></div>
  </ion-page>
</template>
<script>
import { IonPage, IonContent } from '@ionic/vue';
import DefaultHeader from '../components/global/DefaultHeader.vue';
import H from '@here/maps-api-for-javascript';
import { mapGetters, mapActions } from 'vuex';
import hereConfig from '../../../configs/here.json';

export default {
  name: 'Map',
  components: {
    IonPage,
    IonContent,
    DefaultHeader,
  },
  data() {
    return {
      platform: null,
      apikey: hereConfig.apiKey,
      map: null,
      mapUi: null,
      mapPartnerGroup: null,
      mapCurrentPosGroup: null,
    };
  },
  computed: {
    ...mapGetters('geo', {
      getLocation: 'getLocation',
    }),
    ...mapGetters('partners', {
      getNearPartners: 'getNearPartners',
    }),
    currentLocation() {
      // fallback location is the location I would profit most of :hehe:
      const locationToReturn = this.getLocation.lat !== 0 ? {lat: this.getLocation.lat, lng: this.getLocation.lng} : { lat: 49.008439, lng: 8.40845 };
      //this.updateCenter()
      return locationToReturn;
    },
  },
  watch: {
    getLocation(newValue, oldValue) {
      console.log('getLocation', newValue);
      setTimeout(() => {
        this.updateCenter();
      }, 500);
    },
    getNearPartners(newValue, oldValue) {
      console.log('getNearPartners', newValue);
      if (newValue) {
        setTimeout(() => {
          this.addPartnersToMap(newValue);
        }, 500);
      }
    },
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
        center: this.currentLocation,
      });
      console.log('this.map', this.map);

      addEventListener('resize', () => {
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
          maxDistance = 10;
        } else if (zoomLevel <= 14) {
          maxDistance = 3;
        } else if (zoomLevel <= 16) {
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

        this.addCurrentPosToMap();
      });

      new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
      this.mapUi = H.ui.UI.createDefault(this.map, mapTypes);
    },
    updateCenter() {
      if (this.mapUi) {
        // man i really need to start using typescript..
        this.mapUi.getMap().setCenter(this.currentLocation, false);
      }
    },
    addPartnersToMap(nearPartners) {
      console.log('addingPartnersToMap');
      if (nearPartners) {
        if (this.mapPartnerGroup) {
          this.map.removeObject(this.mapPartnerGroup);
        }
        this.mapPartnerGroup = new H.map.Group();
        this.map.addObject(this.mapPartnerGroup);
        nearPartners.forEach((partner) => {
          const marker = new H.map.Marker({ lat: partner.lat, lng: partner.lng });
          marker.setData(`<p>${partner.name}</p>`);
          marker.addEventListener(
            'tap',
            (event) => {
              const bubbles = this.mapUi.getBubbles();
              if (bubbles && bubbles.length) {
                console.log(bubbles.length);
                bubbles.forEach((bubble) => {
                  this.mapUi.removeBubble(bubble);
                });
              }

              const bubble = new H.ui.InfoBubble(event.target.getGeometry(), {
                content: event.target.getData(),
              });
              this.mapUi.addBubble(bubble);
            },
            false
          );
          this.mapPartnerGroup.addObject(marker);
        });
      }
    },
    addCurrentPosToMap() {
      console.log('addCurrentPosToMap');
      if (!this.map || !this.mapUi) {
        return;
      }
      if (this.mapCurrentPosGroup) {
        this.mapCurrentPosGroup.removeAll();
      } else {
        this.mapCurrentPosGroup = new H.map.Group();
        this.map.addObject(this.mapCurrentPosGroup);
      }
      if (this.currentLocation) {
        // thanks to https://codepen.io/shaneparsons/pen/MpgEma
        const animatedDot =
          '<svg width="30" height="30" viewbox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" fill="none" r="10" stroke="#383a36" stroke-width="2"><animate attributeName="r" from="8" to="20" dur="1.5s" begin="0s" repeatCount="indefinite"/><animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="indefinite"/></circle><circle cx="20" cy="20" fill="#383a36" r="10"/></svg>';
        const currentPosIcon = new H.map.DomIcon(animatedDot);
        const currentPositionMarker = new H.map.DomMarker({ lat: this.currentLocation.lat, lng: this.currentLocation.lng }, { icon: currentPosIcon });
        this.mapCurrentPosGroup.addObject(currentPositionMarker);
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
