<template>
  <ion-page>
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    <default-header headerTitle="MapAllPartners"></default-header>
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
  name: 'MapAllPartners',
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
      mapEngine: null,
      clustering: {
        dataPoints: null,
        dataProvider: null,
        clusteringLayer: null,
      },
    };
  },
  computed: {
    ...mapGetters('geo', {
      getLocation: 'getLocation',
    }),
    ...mapGetters('partners', {
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
    getMapAllPartners(newValue, oldValue) {
      if (newValue) {
        this.startClustering(newValue);
        console.log('getMapAllPartners', newValue);
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

      new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(this.map));
      this.mapUi = window.H.ui.UI.createDefault(this.map, mapTypes);
      this.mapEngine = this.map.getEngine();

      this.mapEngine.addEventListener('render', this.mapRenderEventHandler);
    },
    mapRenderEventHandler(event) {
        // seems to always trigger event with eventPhase 2 if map is fully rendered!
        if (event.eventPhase === 2) {
            console.log('possibly fully rendered!');
            if (!this.clustering.dataPoints) {
                this.fetchAllPartners();
            }
            this.addCurrentPosToMap();
            this.mapEngine.removeEventListener('render', this.mapRenderEventHandler);
            console.log('REMOVED LISTENER');
        }
    },
    updateCenter() {
      if (this.mapUi) {
        // man i really need to start using typescript..
        this.mapUi.getMap().setCenter(this.currentLocation, true);
      }
    },
    startClustering(data) {
      this.clustering.dataPoints = data.map((item) => {
        // could pass complete object here and not only a string with html node
        return new window.H.clustering.DataPoint(item.lat, item.lng, 1, `<li>${item.name}</li>`);
      })
      console.log('this.clustering.dataPoints[0]', this.clustering.dataPoints[0].data);
      this.clustering.dataProvider = new window.H.clustering.Provider(this.clustering.dataPoints, {
        clusteringOptions: {
          strategy: window.H.clustering.Provider.Strategy.FASTGRID,
          eps: 32,
          minWeight: 2,
          theme: {
            getClusterPresentation: function(cluster) {
              const dataPoints = [];
              cluster.forEachDataPoint(dataPoints.push.bind(dataPoints));
              const randomDataPoint = dataPoints[0],
              data = randomDataPoint.getData();

              // Create a marker from a random point in the cluster
              const clusterMarker = new H.map.Marker(cluster.getPosition(), {
                // Set min/max zoom with values from the cluster,
                // otherwise clusters will be shown at all zoom levels:
                min: cluster.getMinZoom(),
                max: cluster.getMaxZoom()
              });

              // Link data from the random point from the cluster to the marker,
              // to make it accessible inside onMarkerClick
              clusterMarker.setData(data);

              return clusterMarker;
            },
            getNoisePresentation: function (noisePoint) {
              // Get a reference to data object our noise points
              const data = noisePoint.getData(),
                // Create a marker for the noisePoint
                noiseMarker = new H.map.Marker(noisePoint.getPosition(), {
                  // Use min zoom from a noise point
                  // to show it correctly at certain zoom levels:
                  min: noisePoint.getMinZoom(),
                });

              // Link a data from the point to the marker
              // to make it accessible inside onMarkerClick
              noiseMarker.setData(data);

              return noiseMarker;
            },
          },
        }
      });
      this.clustering.dataProvider.addEventListener('tap', this.onMarkerClick);
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
    getBubbleContent(data) {
      // could use this function later on for some data transformation or similar stuff
      return data;
    },
    onMarkerClick(event) {
      let processedDataString = '';
      const processedDataArray = [];
      const position = event.target.getGeometry();
      const data = event.target.getData();
      
      if (data.isCluster) {
        if (data.isCluster()) {
          data.forEachDataPoint((dataPoint) => {
            processedDataArray.push(dataPoint.getData());
          });
          let processed = 0;
          processedDataArray.forEach((entry) => {
            if (processed === 3) {
              return;
            } else {
              processedDataString += entry;
              ++processed;
            }
          })
          if (processedDataArray.length > 3) {
            processedDataString = '<div><ul>' + processedDataString + `</ul><p>and ${processedDataArray.length - 3} others...</p></div>`;
          } else {
            processedDataString = '<div><ul>' + processedDataString + '</ul></div>';
          }
        } else {
          processedDataString = data.getData();
        }
      } else {
        console.log('ELSEELSE');
        processedDataString = data.getData();
      }
      const bubbleContent = this.getBubbleContent(processedDataString);
      let bubble = this.onMarkerClick.bubble;

      console.log('onMarkerClick - stuff', {position,data,bubbleContent,bubble,});
      if (!bubble) {
        bubble = new H.ui.InfoBubble(position, {
          content: bubbleContent
        });
        this.mapUi.addBubble(bubble);
        this.onMarkerClick.bubble = bubble;
      } else {
        bubble.setPosition(position);
        bubble.setContent(bubbleContent);
        bubble.open();
      }

      // not sure if this is better or not :thinking:
      //this.mapUi.getMap().setCenter(position, true);
    }
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

ul {
  padding: 0;
}
</style>
