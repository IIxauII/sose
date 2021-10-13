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
      ></ion-searchbar>
      <ion-list>
        <ion-item 
        v-for="city in filteredSodexoData"
        v-bind:key="city.name"
        button
        @click="cityClicked(city.name)"
        v-bind:href="'/tabs/tab2/' + city.name">
          <ion-label>
            {{ city.name }}
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
} from "@ionic/vue";
import DefaultHeader from '../components/global/DefaultHeader.vue';
import { HTTP } from '@ionic-native/http';
import axios from 'axios';


//export default defineComponent({
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
  },
  data() {
    return {
      filteredSodexoData: null,
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
      this.sodexoData = newValue.data.sort((a, b) => a.name.localeCompare(b.name));
      this.filteredSodexoData = this.sodexoData;
    },
    cityClicked (clickedCity) {
      console.log('cityClicked');
      console.log(clickedCity);
    },
    searchBarValueAdjusted () {
      console.log('searchBarValueAdjusted');
      console.log(this.searchBarValue);
      this.filteredSodexoData = this.sodexoData.filter((city) => { 
        return city.name.toLowerCase().includes(this.searchBarValue.toLowerCase()); 
      });
    }
  }
//});
};
</script>