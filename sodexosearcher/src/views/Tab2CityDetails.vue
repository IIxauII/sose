<template>
  <ion-page>
    <default-header
      :headerTitle='id'
      :showBackButton='true'
    ></default-header>
    <ion-content fullscreen>
      <ion-searchbar
        debounce="250"
        animated
        v-model="searchBarValue"
        @ionChange="searchBarValueAdjusted()"
      >
        <ion-badge 
          color="primary"
        >{{ filteredCitySodexoPartners.length }}</ion-badge>
      </ion-searchbar>
      <ion-list>
        <ion-item
          v-for="(partner, index) in infiniteScrollCitySodexoPartners"
          v-bind:key="index"
          target='_blank'
          v-bind:href='"https://www.google.com/maps/search/?api=1&query=" + partner.name + "," + partner.address'
        >
          <ion-label>{{ partner.name }}</ion-label>
          <ion-note
            v-if="partner.distance"
          >
            {{ partner.distance }} km
          </ion-note>
          <ion-button
            target='_blank'
            v-bind:href='"https://www.google.com/maps/search/?api=1&query=" + partner.name + "," + partner.address'
          >
            <ion-icon :icon="map" />
          </ion-button>
        </ion-item>
      </ion-list>
      <ion-infinite-scroll
        @ionInfinite='loadInfiniteScrollData($event)'
        threshold='100px'
        id='infinite-scroll'
        :disabled='infiniteScrollIsDisabled'
      >
        <ion-infinite-scroll-content
          loading-spinner='bubbles'
          loading-text='Loading more data...'
        ></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script lang="js">
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonButton,
  IonLabel,
  IonIcon,
  IonSearchbar,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonNote,
} from "@ionic/vue";
import { geolocation } from '@ionic-native/geolocation';
import DefaultHeader from '../components/global/DefaultHeader.vue';
import { map } from 'ionicons/icons';
import { useRoute } from 'vue-router';
import { HTTP } from '@ionic-native/http';
import axios from 'axios';
//import { defineComponent } from "@vue/runtime-core";

//export default defineComponent({
export default {
  name: "Tab2CityDetails",
  components: {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonButton,
  IonLabel,
  IonIcon,
  IonSearchbar,
  DefaultHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonNote,
},
  setup() {
    return {
      map,
    }
  },
  data() {
    const route = useRoute();
    const { cityName } = route.params;  

    return {
      cityDetailData: {
          name: null,
          postalCodes: null,
          sodexoPartners: null,
      },
      id: cityName,
      searchBarValue: null,
      filteredCitySodexoPartners: [],
      infiniteScrollIsDisabled: false,
      infiniteScrollCitySodexoPartners: [],
      currentPos: {
        lat: null,
        lng: null,
      },
      sortViaGeo: false,
    }
  },
  mounted() {
    console.log('mounted');
    console.log(this.id);
    const apiEndpoint = process.env.VUE_APP_API_ENDPOINT + 'cities/' + this.id;

    // for ios & android
    HTTP.get(apiEndpoint, {}, {})
      .then((res) => {
        console.log('cordova http');
        console.log(res);
        this.updateCityDetailData(res);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.status);

        // if cordove not available, try to use axios (e.g. webbrowser enddevice)
        axios.get(apiEndpoint)
          .then((res) => {
            console.log('axios http');
            console.log(res);
            this.updateCityDetailData(res);
          })
          .catch((err) => {
            console.log(err);
          })
      })

      
      this.fetchGeoLocation();
  },
  methods: {
    updateCityDetailData (newValue) {
      console.log('updateCityDetailData');
      if (newValue) {
        console.log('newValue', newValue);
        if (newValue.data && newValue.data.length) {
          const data = newValue.data[0];
          const test = JSON.parse(data.sodexo_partners);
          // need to fix savig process on backend side to not run into this issue
          if (test.length) {
            this.cityDetailData = {
              name: data.name,
              postalCodes: data.post_code,
              sodexoPartners: test,
            };
          } else {
            this.cityDetailData = {
              name: data.name,
              postalCodes: data.post_code,
              sodexoPartners: JSON.parse(test),
            };
          }
          this.filteredCitySodexoPartners = this.cityDetailData.sodexoPartners;
          this.loadInfiniteScrollData();
          //console.log(data);
          //console.log(this.cityDetailData);
        } else if (this.sortViaGeo) {
          console.log('this.sortViaGeo update trigger');
          this.cityDetailData.sodexoPartners = this.cityDetailData.sodexoPartners.map((partner) => {
            const rawDistance = this.calcDistance(partner);
            if (rawDistance > 2) {
               return {...partner, distance: Math.round(rawDistance)};
            } else {
               return {...partner, distance: Math.round(rawDistance * 10) / 10};
            }
          });
          this.cityDetailData.sodexoPartners = this.cityDetailData.sodexoPartners.sort((a, b) => a.distance - b.distance);
          console.log('this.cityDetailData - post distance mapping', this.cityDetailData);
          this.filteredCitySodexoPartners = this.cityDetailData.sodexoPartners;
          this.resetInfiniteScrollData();
          console.log(this.currentPos);
          console.log(this.cityDetailData);
        }
      }
      
    },
    searchBarValueAdjusted () {
      console.log('searchBarValueAdjusted');
      console.log(this.searchBarValue);
      const lowerCaseSearchBarValue = this.searchBarValue.toLowerCase();
      this.filteredCitySodexoPartners = this.cityDetailData.sodexoPartners.filter((partner) => { 
        return partner.name.toLowerCase().includes(lowerCaseSearchBarValue); 
      });
      console.log('cityDetailData.sodexoPartners');
      console.log(this.cityDetailData.sodexoPartners.length);
      console.log('filteredCitySodexoPartners');
      console.log(this.filteredCitySodexoPartners.length);
      this.resetInfiniteScrollData();
    },
     loadInfiniteScrollData (event) {
      // default loading amount 25
      let loadDataAmount = 25;
      // if the rest data to be loaded is less than the default amount, adjust to not load empty items
      if (this.filteredCitySodexoPartners.length - this.infiniteScrollCitySodexoPartners.length <= loadDataAmount) {
        loadDataAmount = this.filteredCitySodexoPartners.length - this.infiniteScrollCitySodexoPartners.length;
      }
      const max = this.infiniteScrollCitySodexoPartners.length + loadDataAmount;
      const min = max - loadDataAmount;
      for (let x = min; x < max; x++) {
        this.infiniteScrollCitySodexoPartners.push(this.filteredCitySodexoPartners[x]);
      }
      if (event) {
        event.target.complete();
      }
      // if we have loaded all available data disabled infinite loading event
      if (this.infiniteScrollCitySodexoPartners.length >= this.filteredCitySodexoPartners.length) {
        this.infiniteScrollIsDisabled = true;
      }
    },
    resetInfiniteScrollData() {
      this.infiniteScrollCitySodexoPartners = [];
      this.loadInfiniteScrollData();
      this.infiniteScrollIsDisabled = false;
    },
    fetchGeoLocation() {
      console.log('fetchGeoLocation');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          console.log('navigator.geolocation', pos);
          if (pos.coords) {
            this.currentPos.lat = pos.coords.latitude;
            this.currentPos.lng = pos.coords.longitude;
            this.sortViaGeo = true;
            // retrigger update to sort via geo
            this.updateCityDetailData(this.cityDetailData);
          }
        });
      } else {
        // unsure if this will work 
        // for ios some changes need to be made
        // https://ionicframework.com/docs/native/geolocation
        geolocation.getCurrentPosition().then((res) => {
          console.log('geoRes', res);
        }).catch((err) => {
          console.log('error', err);
        });
      }
    },
    calcDistance(city) {
      const lat2 = city.lat;
      const lng2 = city.lng;
      const p = 0.017453292519943295;    // Math.PI / 180
      const c = Math.cos;
      const a = 0.5 - c((lat2 - this.currentPos.lat) * p)/2 + 
              c(this.currentPos.lat * p) * c(lat2 * p) * 
              (1 - c((lng2 - this.currentPos.lng) * p))/2;

      return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    },
  }
//});
};
</script>