<template>
  <div>
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Cities</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <ion-list>
        <ion-item v-for="city in sodexoData" v-bind:key="city.name">
          <ion-label>
            <h3>{{ city.name }}</h3>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </div>
</template>

<script>
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/vue';
import { defineComponent } from '@vue/runtime-core';
export default defineComponent({
    name: 'CitiesNavRoot',
    components: [
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonList,
        IonItem,
        IonLabel,
    ],
    props: ['sodexoData'],
});
</script>