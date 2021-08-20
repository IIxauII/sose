<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
            <ion-back-button default-href="/tabs/tab2"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ id }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item v-for="(partner, index) in cityDetailData.sodexoPartners" v-bind:key="index">
          {{ partner.name }}
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="js">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonBackButton,
  IonButtons,
} from "@ionic/vue";
import { useRoute } from 'vue-router';
import { HTTP } from '@ionic-native/http';
import axios from 'axios';
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "Tab2CityDetails",
  components: {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonBackButton,
  IonButtons,
},
  data() {
    const route = useRoute();
    const { cityName } = route.params;  

    return {
      cityDetailData: {
          name: null,
          sodexoPartners: null,
      },
      id: cityName
    }
  },
  mounted() {
    console.log('mounted');
    console.log(this.id);
    const apiEndpoint = 'http://localhost:1337/api/cities/' + this.id;

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
  },
  methods: {
    updateCityDetailData (newValue) {
      console.log('updateCityDetailData');
      const data = newValue.data[0];
      this.cityDetailData = {
          name: data.name,
          postalCodes: data.post_code,
          sodexoPartners: JSON.parse(JSON.parse(data.sodexo_partners)),
      };
      console.log(data);
      console.log(this.cityDetailData);
    }
  }
});
</script>