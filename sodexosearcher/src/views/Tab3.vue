<template>
  <ion-page>
     <ion-header translucent>
      <ion-toolbar>
        <ion-title>Request a new city</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid>
        <ion-row justify-content-center align-items-center>
          <ion-input
          placeholder="Enter city you would like to add"
          v-model='cityInputValue'
          ></ion-input>
          <ion-button
            @click="addCity()"
          >Add city</ion-button>
        </ion-row>
      </ion-grid>
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
  IonInput,
  IonButton,
  IonGrid,
  IonRow,
  loadingController,
  toastController,
} from '@ionic/vue'
import { HTTP } from '@ionic-native/http';
import axios from 'axios';

export default  {
  name: 'Tab3',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonButton,
    IonGrid,
    IonRow,
  },
  data() {
    return {
      cityInputValue: null,
    };
  },
  methods: {
    addCity() {
      console.log('addCity');
      console.log(this.cityInputValue);
      if (!this.cityInputValue) { return; }
      const cityToAdd = this.cityInputValue;
      this.showLoader();
      const apiEndpoint = 'http://localhost:1337/api/cities/' + cityToAdd;

      // for ios & android
      HTTP.post(apiEndpoint, {}, {})
        .then((res) => {
          console.log('cordova http');
          console.log(res);
          this.cleanUpAfterRequest(true, cityToAdd);
        })
        .catch((err) => {
          console.log(err);
          console.log(err.status);

          // if cordove not available, try to use axios (e.g. webbrowser enddevice)
          axios.post(apiEndpoint)
            .then((res) => {
              console.log('axios http');
              console.log(res);
              this.cleanUpAfterRequest(true, cityToAdd);
            })
            .catch((err) => {
              console.log(err);
              this.cleanUpAfterRequest(false, cityToAdd);
            })
        })
    },
    showLoader() {
      loadingController.create({
        message: 'Hold tight...'
      }).then((res) => {
        res.present();
      });
    },
    hideLoader() {
      loadingController.dismiss().then((res) => {
        console.log('Loading abooorted!', res);
      }).catch((error) => {
        console.log('error', error);
      });
    },
    cleanUpAfterRequest(wasSuccess, cityName) {
      this.hideLoader();
      this.cityInputValue = null;
      const toastOptions = {
        message: 'Adding ' + cityName + ' failed!',
        color: 'danger',
        duration: 5000,
        position: 'top',
        animated: true,
      };
      if (wasSuccess) {
        toastOptions.message = 'Added ' + cityName;
        toastOptions.color = 'success';
      }
      toastController.create(toastOptions).then((res) => {
        res.present();
      });
    },
  },
}
</script>

<style scoped>
ion-grid {
  height: 100%;
}
ion-row {
  height: 100%;
  flex-direction: column;
}
</style>