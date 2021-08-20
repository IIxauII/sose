<template>
  <!-- List of Text Items -->
  <ion-list>
    <ion-item>
      <ion-label>Pokémon Yellow</ion-label>
    </ion-item>
    <ion-item>
      <ion-label>Mega Man X</ion-label>
    </ion-item>
    <ion-item>
      <ion-label>The Legend of Zelda</ion-label>
    </ion-item>
    <ion-item>
      <ion-label>Pac-Man</ion-label>
    </ion-item>
    <ion-item>
      <ion-label>Super Mario World</ion-label>
    </ion-item>

  <!-- List of Input Items -->
    <ion-item>
      <ion-label>Input</ion-label>
      <ion-input></ion-input>
    </ion-item>
    <ion-item>
      <ion-label>Toggle</ion-label>
      <ion-toggle slot="start"></ion-toggle>
    </ion-item>
    <ion-item>
      <ion-label>Radio</ion-label>
      <ion-radio slot="start"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>Checkbox</ion-label>
      <ion-checkbox slot="start"></ion-checkbox>
    </ion-item>

  <!-- List of Sliding Items -->
    <ion-item-sliding>
      <ion-item>
        <ion-label>asdfsdaf</ion-label>
      </ion-item>
      <ion-item-options side="start">
        <ion-item-option @click="unread(item)">Unread</ion-item-option>
      </ion-item-options>
    </ion-item-sliding>

    <ion-item-sliding>
      <ion-item>
        <ion-label>Item</ion-label>
      </ion-item>
      <ion-item-options side="start">
        <ion-item-option @click="unread(item)">Unread</ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </ion-list>
</template>

<script>
import {
  IonCheckbox,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonList,
  IonLabel,
  IonRadio,
  IonToggle,
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    IonCheckbox,
    IonInput,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonList,
    IonLabel,
    IonRadio,
    IonToggle,
  },
});
</script>