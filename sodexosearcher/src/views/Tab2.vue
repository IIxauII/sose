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
        v-for="city in infiniteScrollSodexoData"
        v-bind:key="city"
        button
        @click="cityClicked(city)"
        v-bind:href="'/tabs/tab2/' + city">
          <ion-label>
            {{ city }}
          </ion-label>
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
} from "@ionic/vue";
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
  },
  data() {
    return {
      infiniteScrollIsDisabled: false,
      infiniteScrollSodexoData: [],
      filteredSodexoData: [],
      sodexoData: null,
      searchBarValue: null,
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
  },
  methods: {
    updateSodexoData (newValue) {
      this.sodexoData = newValue.data.sort((a, b) => a.localeCompare(b));
      this.filteredSodexoData = this.sodexoData;
      this.loadInfiniteScrollData();
    },
    cityClicked (clickedCity) {
      console.log('cityClicked');
      console.log(clickedCity);
    },
    searchBarValueAdjusted () {
      // might want to change this to a computed property
      const lowerCaseSearchBarValue = this.searchBarValue.toLowerCase();
      this.filteredSodexoData = this.sodexoData.filter((city) => { 
        return city.toLowerCase().includes(lowerCaseSearchBarValue); 
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
    }
  }
};
</script>