<template>
  <ion-page>
    <default-header headerTitle="Debug"></default-header>
    <ion-content fullscreen>
      <ion-list-header>
        <ion-label>Debug Log</ion-label>
        <ion-button @click="buttonClicked(buttons.debugList.name)">{{
          buttons.debugList.state ? text.hide : text.show
        }}</ion-button>
      </ion-list-header>
      <ion-list v-if="buttons.debugList.state">
        <div
          v-for="(data, index) in getDebug"
          v-bind:key="index"
          class="debugItem"
        >
          <span>{{ createDebugLogString(data, true) }}</span>
          <ion-text v-bind:color="fetchLogLevelColor(data.logLevel)">
            <span>{{ createDebugLogString(data) }}</span>
          </ion-text>
        </div>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonList,
  IonListHeader,
  IonLabel,
  IonText,
} from "@ionic/vue";
import DefaultHeader from "../components/global/DefaultHeader.vue";
import { mapGetters } from "vuex";

export default {
  name: "Debug",
  components: {
    DefaultHeader,
    IonPage,
    IonContent,
    IonList,
    IonListHeader,
    IonLabel,
    IonText,
  },
  data() {
    return {
      text: {
        show: "Show",
        hide: "Hide",
      },
      buttons: {
        debugList: {
          state: true,
          name: "debugList",
        },
      },
    };
  },
  mounted() {
    console.log("Mounted Debug!");
  },
  computed: {
    ...mapGetters("debug", {
      getDebug: "getDebug",
    }),
  },
  methods: {
    buttonClicked(buttonName) {
      this.buttons[buttonName].state = !this.buttons[buttonName].state;
    },
    fetchLogLevelColor(data) {
      switch (data) {
        case 0:
          return "success";
        case 1:
          return "primary";
        case 2:
          return "warning";
        case 3:
          return "danger";
        default:
          return "none";
      }
    },
    createDebugLogString(data, firstPart) {
        if (firstPart) {
            return `${data.time} `;
        }
        return `[${data.initiator}][${data.caller}] - ${data.message}`;
    }
  },
};
</script>

<style>
.debugItem span {
  font-size: 0.8rem;
}
</style>