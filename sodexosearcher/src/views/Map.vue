<template>
  <ion-page>
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    <!-- <link rel="stylesheet" type="text/css" href="https://js.api.here.com/v3/3.1/mapsjs-ui.css" /> -->
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

// I REALLY NEED TO START USING TYPESCRIPT HERE!
/* import ArrayCompareService from '../services/arrayService';
const arrayCompareService = new ArrayCompareService(); */

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
      clustering: {
        dataPoints: null,
        dataProvider: null,
        clusteringLayer: null,
      }
    };
  },
  computed: {
    ...mapGetters('geo', {
      getLocation: 'getLocation',
    }),
    ...mapGetters('partners', {
      getNearPartners: 'getNearPartners',
      getMapAllPartners: 'getMapAllPartners',
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
      if (newValue) {
        setTimeout(() => {
          console.log('getNearPartners - new', newValue);
          console.log('getNearPartners - old', oldValue);
          console.log('inBoth', this.inBoth(newValue, oldValue, 'name'));
          console.log('inFirstOnly (newvalue)', this.inFirstOnly(newValue, oldValue, 'name'));
          console.log('inSecondOnly (oldvalue)', this.inSecondOnly(newValue, oldValue, 'name'));
          const partnersToAdd = this.inFirstOnly(newValue, oldValue, 'name');
          const partnersToRemove = this.inSecondOnly(newValue, oldValue, 'name');
          //this.addPartnersToMap(newValue);
          this.manageMapPoints(partnersToAdd, partnersToRemove);
        }, 500);
      }
    },
    getMapAllPartners(newValue, oldValue) {
      if (newValue) {
        this.startClustering(newValue);
      }
    }
  },
  mounted() {
    setTimeout(() => {
      console.log('trying to add here map service now!');
      this.platform = new window.H.service.Platform({
        apikey: this.apikey,
      });
      this.initializeHereMap();
    }, 500);
  },
  methods: {
    ...mapActions('partners', {
      fetchNearPartners: 'fetchNearPartners',
      fetchAllPartners: 'fetchAllPartners',
    }),
    initializeHereMap() {
      const mapContainer = this.$refs.hereMap;
      const mapTypes = this.platform.createDefaultLayers();

      this.map = new window.H.Map(mapContainer, mapTypes.vector.normal.map, {
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
       /*  this.fetchNearPartners({
          lat: center.lat,
          lng: center.lng,
          maxDistance,
        }); */
        this.addCurrentPosToMap();
      });

      new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(this.map));
      this.mapUi = window.H.ui.UI.createDefault(this.map, mapTypes);
      this.fetchAllPartners();
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
        this.startClustering(nearPartners);
        return;
        /* if (this.mapPartnerGroup) {
          this.map.removeObject(this.mapPartnerGroup);
        }
        this.mapPartnerGroup = new window.H.map.Group();
        this.map.addObject(this.mapPartnerGroup);
        nearPartners.forEach((partner) => {
          const marker = new window.H.map.Marker({ lat: partner.lat, lng: partner.lng });
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

              const bubble = new window.H.ui.InfoBubble(event.target.getGeometry(), {
                content: event.target.getData(),
              });
              this.mapUi.addBubble(bubble);
            },
            false
          );
          this.mapPartnerGroup.addObject(marker);
        }); */
      }
    },
    manageMapPoints(partnersToAdd, partnersToRemove) {
      if (!partnersToAdd && !partnersToRemove) {
        return;
      } else {
        // initialize clustering
        if (!this.clustering.dataProvider && !this.clustering.clusteringLayer) {
          this.startClustering(partnersToAdd);
        } else {
          // update cluster
          if (partnersToAdd) {
            const toAddDataPoints = partnersToAdd.map((item) => {
              return new window.H.clustering.DataPoint(item.lat, item.lng);
            });
            this.clustering.dataProvider.addDataPoints(toAddDataPoints);
          }
          if (partnersToRemove) {
            const toRemoveDataPoints = partnersToRemove.map((item) => {
              return new window.H.clustering.DataPoint(item.lat, item.lng);
            })
            toRemoveDataPoints.forEach((dataPoint) => {
              this.clustering.dataProvider.removeDataPoint(dataPoint);
            })
          }
        }
      }
    },
    startClustering(data) {
      this.clustering.dataPoints = data.map((item) => {
        return new window.H.clustering.DataPoint(item.lat, item.lng);
      })
      this.clustering.dataProvider = new window.H.clustering.Provider(this.clustering.dataPoints, {
        clusteringOptions: {
          eps: 32,
          minWeight: 2,
        }
      });
      this.clustering.clusteringLayer = new window.H.map.layer.ObjectLayer(this.clustering.dataProvider);
      this.map.addLayer(this.clustering.clusteringLayer);
    },
    addCurrentPosToMap() {
      console.log('addCurrentPosToMap');
      if (!this.map || !this.mapUi) {
        return;
      }
      if (this.mapCurrentPosGroup) {
        this.mapCurrentPosGroup.removeAll();
      } else {
        this.mapCurrentPosGroup = new window.H.map.Group();
        this.map.addObject(this.mapCurrentPosGroup);
      }
      if (this.currentLocation) {
        // thanks to https://codepen.io/shaneparsons/pen/MpgEma
        const animatedDot =
          '<svg width="30" height="30" viewbox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" fill="none" r="10" stroke="#383a36" stroke-width="2"><animate attributeName="r" from="8" to="20" dur="1.5s" begin="0s" repeatCount="indefinite"/><animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="indefinite"/></circle><circle cx="20" cy="20" fill="#383a36" r="10"/></svg>';
        const currentPosIcon = new window.H.map.DomIcon(animatedDot);
        const currentPositionMarker = new window.H.map.DomMarker({ lat: this.currentLocation.lat, lng: this.currentLocation.lng }, { icon: currentPosIcon });
        this.mapCurrentPosGroup.addObject(currentPositionMarker);
      }
    },
    operation(list1, list2, propertyToCompare, isUnion = false) {
      return list1.filter(a => isUnion === list2.some(b => a[propertyToCompare] === b[propertyToCompare]));
    },
    inBoth(list1, list2, propertyToCompare) {
        return this.operation(list1, list2, propertyToCompare, true);
    },
    inFirstOnly(list1, list2, propertyToCompare) {
        return this.operation(list1, list2, propertyToCompare);
    },
    inSecondOnly(list1, list2, propertyToCompare) {
        return this.operation(list2, list1, propertyToCompare);
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
