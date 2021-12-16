<template>
  <ion-page>
      <default-header headerTitle="Settings" :showBackButton="true"></default-header>
      <ion-content fullscreen>
          hello settings
      </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
} from "@ionic/vue";
import DefaultHeader from '../../components/global/DefaultHeader.vue';

export default {
    name: 'Settings',
    components: {
        IonPage,
        IonContent,
        DefaultHeader,
    },
}
</script>

<style>

</style>