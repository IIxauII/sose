<template>
  <div>
    <ion-header translucent>
      <ion-toolbar>
        <ion-buttons v-if="showBackButton" slot="start">
          <ion-back-button v-bind:default-href="backButtonLink"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ headerTitle }}</ion-title>
        <ion-buttons slot="end">
          <ion-menu-button
            menu='menu'
          ></ion-menu-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
  </div>
</template>

<script>
import { IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonMenuButton } from '@ionic/vue';


export default {
  name: 'defaultHeader',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonMenuButton,
  },
  props: {
    headerTitle: {
      type: String,
      default: 'HeaderTitle',
    },
    showBackButton: {
      type: Boolean,
      default: false,
    },
    backButtonLink: {
      type: String,
      default: '/tabs/tab2',
    },
  },
  data() {
    return {};
  },
};
</script>

<style></style>
