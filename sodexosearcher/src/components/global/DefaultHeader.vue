<template>
  <ion-header translucent>
      <ion-toolbar>
        <ion-buttons 
          v-if='showBackButton'
          slot='start'
        >
          <ion-back-button v-bind:default-href='backButtonLink'></ion-back-button>
        </ion-buttons>
        <ion-title>{{ headerTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>
</template>

<script>
import {
 IonHeader,
 IonToolbar,
 IonTitle,
} from '@ionic/vue';

export default {
 name: 'defaultHeader',
 components: {
     IonHeader,
     IonToolbar,
     IonTitle,
 },
 props: {
   headerTitle: {
     type: String,
     default: 'HeaderTitle'
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
}
</script>

<style>

</style>