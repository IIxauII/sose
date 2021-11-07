<template>
  <ion-page>
    <default-header
      headerTitle='Cities'
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
        >{{ filteredSodexoData.length }}</ion-badge>
      </ion-searchbar>
      <ion-list>
        <ion-item 
        v-for="(city, index) in infiniteScrollSodexoData"
        v-bind:key="index"
        button
        @click="cityClicked(city.name)"
        v-bind:href="'/tabs/tab2/' + city.name">
          <ion-label>
            {{ city.name }}
          </ion-label>
          <ion-note
            v-if="city.distance"
          >
            {{ city.distance }} km
          </ion-note>
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
//ion nav: https://github.com/ionic-team/ionic-framework/tree/3a0465e7d6f9e3cb01336a8bdbd7001e4ec34559/packages/vue/test-app/src/components

import {
  IonPage,
  IonContent,
  IonItem,
  IonList,
  IonLabel,
  IonSearchbar,
  IonBadge,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonNote,
} from "@ionic/vue";
import { geolocation } from '@ionic-native/geolocation';
import DefaultHeader from '../components/global/DefaultHeader.vue';
import { HTTP } from '@ionic-native/http';
import axios from 'axios';

export default {
  name: "Tab2",
  components: {
    IonPage,
    IonContent,
    IonItem,
    IonList,
    IonLabel,
    IonSearchbar,
    DefaultHeader,
    IonBadge,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonNote,
  },
  data() {
    return {
      infiniteScrollIsDisabled: false,
      infiniteScrollSodexoData: [],
      filteredSodexoData: [],
      sodexoData: null,
      searchBarValue: null,
      currentPos: {
        lat: null,
        lng: null,
      },
      sortViaGeo: false,
    }
  },
  mounted() {
    const apiEndpoint = process.env.VUE_APP_API_ENDPOINT + 'cities';

    // for ios & android
    HTTP.get(apiEndpoint, {}, {})
      .then((res) => {
        this.updateSodexoData(res);
      })
      .catch((err) => {
        console.error(err);
        // if cordove not available, try to use axios (e.g. webbrowser enddevice)
        axios.get(apiEndpoint)
          .then((res) => {
            this.updateSodexoData(res);
          })
          .catch((err) => {
            console.error(err);
          })
      })

    this.fetchGeoLocation();
  },
  methods: {
    updateSodexoData (newValue) {
      if (newValue) {
        if (this.sortViaGeo) {
          console.log('updateSodexoData - this.sortViaGeo', newValue);
          this.sodexoData = this.sodexoData.map((city) => ({...city, distance: Math.round(this.calcDistance(city))}));
          this.sodexoData = this.sodexoData.sort((a, b) => a.distance - b.distance);
          this.filteredSodexoData = this.sodexoData;
          this.resetInfiniteScrollData();
          console.log(this.currentPos);
          console.log(this.sodexoData);
        } else {
          console.log('updateSodexoData - default', newValue);
          this.sodexoData = newValue.data.sort((a, b) => a.name.localeCompare(b.name));
          this.filteredSodexoData = this.sodexoData;
          this.loadInfiniteScrollData();
        }
      }
    },
    cityClicked (clickedCity) {
      console.log('cityClicked');
      console.log(clickedCity);
    },
    searchBarValueAdjusted () {
      // might want to change this to a computed property
      const lowerCaseSearchBarValue = this.searchBarValue.toLowerCase();
      this.filteredSodexoData = this.sodexoData.filter((city) => { 
        return city.name.toLowerCase().includes(lowerCaseSearchBarValue); 
      });
      this.resetInfiniteScrollData();
    },
    loadInfiniteScrollData (event) {
      // default loading amount 25
      let loadDataAmount = 25;
      // if the rest data to be loaded is less than the default amount, adjust to not load empty items
      if (this.filteredSodexoData.length - this.infiniteScrollSodexoData.length <= loadDataAmount) {
        loadDataAmount = this.filteredSodexoData.length - this.infiniteScrollSodexoData.length;
      }
      const max = this.infiniteScrollSodexoData.length + loadDataAmount;
      const min = max - loadDataAmount;
      for (let x = min; x < max; x++) {
        this.infiniteScrollSodexoData.push(this.filteredSodexoData[x]);
      }
      if (event) {
        event.target.complete();
      }
      // if we have loaded all available data disabled infinite loading event
      if (this.infiniteScrollSodexoData.length >= this.filteredSodexoData.length) {
        this.infiniteScrollIsDisabled = true;
      }
    },
    resetInfiniteScrollData() {
      this.infiniteScrollSodexoData = [];
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
            this.updateSodexoData(this.sodexoData);
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
};
</script>