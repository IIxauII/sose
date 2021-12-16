<template>
  <div>
    <ion-menu side="end" menuId="menu" contentId="main">
      <ion-header>
        <ion-toolbar>
          <ion-title>Menu</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <ion-item @click="menuItemClicked('Settings')">
            <ion-icon :icon="settingsOutline" slot="start" color="primary"></ion-icon>
            <ion-label>Settings</ion-label>
          </ion-item>
          <ion-item @click="menuItemClicked('FAQ')">
            <ion-icon :icon="helpCircleOutline" slot="start" color="primary"></ion-icon>
            <ion-label>FAQ</ion-label>
          </ion-item>
          <ion-item @click="menuItemClicked('Info')">
            <ion-icon :icon="informationCircleOutline" slot="start" color="primary"></ion-icon>
            <ion-label>Info</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-menu>
    <ion-router-outlet id="main"></ion-router-outlet>
  </div>
</template>

<script>
import { IonHeader, IonContent, IonMenu, IonList, IonItem, IonTitle, menuController, IonIcon, IonLabel, IonToolbar, IonRouterOutlet } from '@ionic/vue';
import { settingsOutline, helpCircleOutline, informationCircleOutline } from 'ionicons/icons';

export default {
  name: 'SoseMenu',
  components: {
    IonHeader,
    IonContent,
    IonMenu,
    IonList,
    IonItem,
    IonTitle,
    IonIcon,
    IonLabel,
    IonToolbar,
    IonRouterOutlet,
  },
  setup() {
    return {
      settingsOutline,
      helpCircleOutline,
      informationCircleOutline,
    };
  },
  mounted() {
    menuController
      .isEnabled('menu')
      .then((data) => {
        console.log('should be enabled', data);
      })
      .catch((err) => {
        throw err;
      });
    menuController
      .enable(true, 'menu')
      .then((data) => {
        console.log('triggered enable', data);
      })
      .catch((err) => {
        throw err;
      });
  },
  methods: {
    menuItemClicked(clickedItem) {
      this.$router.push(`/menu/${clickedItem}`);
      menuController.close('menu');
    },
  },
};
</script>

<style></style>
