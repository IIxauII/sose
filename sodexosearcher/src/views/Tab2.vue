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
        v-for="city in filteredSodexoData"
        v-bind:key="city"
        button
        @click="cityClicked(city)"
        v-bind:href="'/tabs/tab2/' + city">
          <ion-label>
            {{ city }}
          </ion-label>
        </ion-item>
      </ion-list>
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
  },
  data() {
    return {
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
        console.log('cordova http');
        console.log(res);
        this.updateSodexoData(res);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.status);

        // if cordove not available, try to use axios (e.g. webbrowser enddevice)
        axios.get(apiEndpoint)
          .then((res) => {
            console.log('axios http');
            console.log(res);
            this.updateSodexoData(res);
          })
          .catch((err) => {
            console.log(err);
          })
      })
  },
  methods: {
    updateSodexoData (newValue) {
      console.log('updateSodexoData');
      console.log(newValue.data)
      this.sodexoData = newValue.data.sort((a, b) => a.localeCompare(b));
      this.filteredSodexoData = this.sodexoData;
    },
    cityClicked (clickedCity) {
      console.log('cityClicked');
      console.log(clickedCity);
    },
    searchBarValueAdjusted () {
      // might want to change this to a computed property
      console.log('searchBarValueAdjusted');
      console.log(this.searchBarValue);
      const lowerCaseSearchBarValue = this.searchBarValue.toLowerCase();
      this.filteredSodexoData = this.sodexoData.filter((city) => { 
        return city.toLowerCase().includes(lowerCaseSearchBarValue); 
      });
    }
  }
};
</script>