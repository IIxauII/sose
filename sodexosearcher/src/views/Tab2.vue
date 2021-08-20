<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Cities</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <ion-searchbar></ion-searchbar>
      <ion-list>
        <ion-item 
        v-for="city in sodexoData"
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
  IonToolbar,
  IonTitle,
  IonHeader,
  IonContent,
  IonItem,
  IonList,
  IonLabel,
  IonButton,
  IonSearchbar,
} from "@ionic/vue";
import { HTTP } from '@ionic-native/http';
import axios from 'axios';
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "Tab2",
  components: [ IonPage, IonToolbar, IonTitle, IonHeader, IonContent, IonItem, IonList, IonLabel, IonButton, IonSearchbar],
  data() {
    return {
      sodexoData: null
    }
  },
  mounted() {
    const apiEndpoint = 'http://localhost:1337/api/cities';

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
      this.sodexoData = newValue.data;
    },
    cityClicked (clickedCity) {
      console.log('cityClicked');
      console.log(clickedCity);
    }
  }
});
</script>