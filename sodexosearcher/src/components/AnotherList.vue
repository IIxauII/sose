<template>
  <div>
    <div v-for='value in sodexoCities' v-bind:key='value.name'>
      {{ value.name }}
    </div>
    <ion-nav></ion-nav>
  </div>
</template>

<script>
import { IonNav } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "AlternativeList",
  components: {
    IonNav,
  },
  props: ["sodexoCities"],
  mounted() {
    console.log('created');
    console.log(this.sodexoCities);
  },
  updated() {
    console.log('updated');
    console.log(this.sodexoCities);
  }
});
</script>