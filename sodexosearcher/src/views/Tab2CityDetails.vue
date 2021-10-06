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

    <ion-content fullscreen>
      <ion-searchbar
        debounce="250"
        animated
        v-model="searchBarValue"
        @ionChange="searchBarValueAdjusted()"
      ></ion-searchbar>
      <ion-list>
        <ion-item
          v-for="(partner, index) in filteredCitySodexoPartners"
          v-bind:key="index"
          target='_blank'
          v-bind:href='"https://www.google.com/maps/search/?api=1&query=" + partner.name + "," + partner.address'
        >
          <ion-label>{{ partner.name }}</ion-label>
          <ion-button
            target='_blank'
            v-bind:href='"https://www.google.com/maps/search/?api=1&query=" + partner.name + "," + partner.address'
          >
            <ion-icon :icon="map" />
          </ion-button>
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
  IonButton,
  IonLabel,
  IonIcon,
  IonSearchbar,
} from "@ionic/vue";
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
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonBackButton,
  IonButtons,
  IonButton,
  IonLabel,
  IonIcon,
  IonSearchbar,
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
          sodexoPartners: null,
      },
      id: cityName,
      searchBarValue: null,
      filteredCitySodexoPartners: null,
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
      this.filteredCitySodexoPartners = this.cityDetailData.sodexoPartners;
      //console.log(data);
      //console.log(this.cityDetailData);
    },
    searchBarValueAdjusted () {
      console.log('searchBarValueAdjusted');
      console.log(this.searchBarValue);
      this.filteredCitySodexoPartners = this.cityDetailData.sodexoPartners.filter((partner) => { 
        return partner.name.toLowerCase().includes(this.searchBarValue.toLowerCase()); 
      });
      console.log('cityDetailData.sodexoPartners');
      console.log(this.cityDetailData.sodexoPartners.length);
      console.log('filteredCitySodexoPartners');
      console.log(this.filteredCitySodexoPartners.length);
    },
  }
//});
};
</script>