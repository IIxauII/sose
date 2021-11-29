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
      >
        <ion-badge 
          color="primary"
        >{{ getCities.length }}</ion-badge>
      </ion-searchbar>
      <ion-list>
        <ion-item 
        v-for="(city, index) in infiniteScrollSodexoData"
        v-bind:key="index"
        button
        @click="cityClicked(city.name)"
        >
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
import { mapGetters } from 'vuex';

export default {
  name: "Tab2Store",
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
      searchBarValue: null,
      getCitiesFiltered: [],
      infiniteScrollSodexoData: [],
      infiniteScrollIsDisabled: false,
    }
  },
  computed: {
      ...mapGetters('cities', {
          getCities: 'getCities',
      }),
  },
  watch: {
    getCities(newValue, oldValue) {
      this.resetInfiniteScrollData();
    },
    searchBarValue(newValue, oldValue) {
      const lowerCaseSearchBarValue = newValue.toLowerCase();
      this.getCitiesFiltered = this.getCities.filter((city) => { 
        return city.name.toLowerCase().includes(lowerCaseSearchBarValue); 
      });
      this.resetInfiniteScrollData()
    },
  },
  mounted() {
      console.log('tab2store mounted!');
      this.loadInfiniteScrollData();
  },
  methods: {
    cityClicked (clickedCity) {
      this.$router.push(`/tabs/tab2/${clickedCity}`);
    },
    loadInfiniteScrollData (event) {
      let dataToWorkWith = [];
      if (this.searchBarValue) {
        dataToWorkWith = this.getCitiesFiltered;
      } else {
        dataToWorkWith = this.getCities;
      }

      // default loading amount 25
      let loadDataAmount = 25;
      // if the rest data to be loaded is less than the default amount, adjust to not load empty items
      if (dataToWorkWith.length - this.infiniteScrollSodexoData.length <= loadDataAmount) {
        loadDataAmount = dataToWorkWith.length - this.infiniteScrollSodexoData.length;
      }
      const max = this.infiniteScrollSodexoData.length + loadDataAmount;
      const min = max - loadDataAmount;
      for (let x = min; x < max; x++) {
        this.infiniteScrollSodexoData.push(dataToWorkWith[x]);
      }
      if (event) {
        event.target.complete();
      }
      // if we have loaded all available data disabled infinite loading event
      if (this.infiniteScrollSodexoData.length >= dataToWorkWith.length) {
        this.infiniteScrollIsDisabled = true;
      }
    },
    resetInfiniteScrollData() {
      this.infiniteScrollSodexoData = [];
      this.loadInfiniteScrollData();
      this.infiniteScrollIsDisabled = false;
    },
  }
};
</script>