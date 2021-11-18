<template>
  <ion-page>
    <default-header :headerTitle="id" :showBackButton="true"></default-header>
    <ion-content fullscreen>
      <ion-searchbar debounce="250" animated v-model="searchBarValue">
        <ion-badge color="primary">{{
          this.getCityFiltered.sodexoPartners.length
        }}</ion-badge>
      </ion-searchbar>
      <ion-list>
        <ion-item
          v-for="(partner, index) in infiniteScrollCityData.sodexoPartners"
          v-bind:key="index"
          target="_blank"
          v-bind:href="
            'https://www.google.com/maps/search/?api=1&query=' +
              partner.name +
              ',' +
              partner.address
          "
        >
          <ion-label>{{ partner.name }}</ion-label>
          <ion-note v-if="partner.distance">
            {{ partner.distance }} km
          </ion-note>
          <ion-button
            target="_blank"
            v-bind:href="
              'https://www.google.com/maps/search/?api=1&query=' +
                partner.name +
                ',' +
                partner.address
            "
          >
            <ion-icon :icon="map" />
          </ion-button>
        </ion-item>
      </ion-list>
      <ion-infinite-scroll
        @ionInfinite="loadInfiniteScrollData($event)"
        threshold="100px"
        id="infinite-scroll"
        :disabled="infiniteScrollIsDisabled"
      >
        <ion-infinite-scroll-content
          loading-spinner="bubbles"
          loading-text="Loading more data..."
        ></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonButton,
  IonLabel,
  IonIcon,
  IonSearchbar,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonNote,
  IonBadge,
} from "@ionic/vue";
import DefaultHeader from "../components/global/DefaultHeader.vue";
import { map } from "ionicons/icons";
import { useRoute } from "vue-router";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "Tab2CityDetails",
  components: {
    IonPage,
    IonContent,
    IonList,
    IonItem,
    IonButton,
    IonLabel,
    IonIcon,
    IonSearchbar,
    DefaultHeader,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonNote,
    IonBadge,
  },
  setup() {
    return {
      map,
    };
  },
  data() {
    const route = useRoute();
    const { cityName } = route.params;

    return {
      searchBarValue: null,
      id: cityName,
      getCityFiltered: {
        sodexoPartners: [],
      },
      infiniteScrollCityData: {
        sodexoPartners: [],
      },
      infiniteScrollIsDisabled: false,
    };
  },
  computed: {
    ...mapGetters("partners", {
      getPartnersOfCurrentCity: "getPartnersOfCurrentCity",
    }),
  },
  watch: {
    getPartnersOfCurrentCity(newValue, oldValue) {
      this.resetInfiniteScrollData();
      // kind of a workaround to get the partner count to update once data has been fetched
      this.searchBarValue = '';
    },
    searchBarValue(newValue, oldValue) {
      if (this.getPartnersOfCurrentCity) {
        const lowerCaseSearchBarValue = newValue.toLowerCase();
        this.getCityFiltered = {
          ...this.getPartnersOfCurrentCity,
          sodexoPartners: this.getPartnersOfCurrentCity.sodexoPartners.filter(
            (partner) => {
              return partner.name
                .toLowerCase()
                .includes(lowerCaseSearchBarValue);
            }
          ),
        };
        this.resetInfiniteScrollData();
      }
    },
  },
  mounted() {
    console.log("tab2CityDetailsStore mounted!");
    this.setCurrentCity(this.id);
    this.fetchCityWithPartners(this.id);
    this.loadInfiniteScrollData();
  },
  methods: {
    ...mapMutations("partners", {
      setCurrentCity: "setCurrentCity",
    }),
    ...mapActions("partners", {
      fetchCityWithPartners: "fetchCityWithPartners",
    }),
    loadInfiniteScrollData(event) {
      let dataToWorkWith = [];
      if (this.searchBarValue) {
        dataToWorkWith = this.getCityFiltered.sodexoPartners;
      } else if (this.getPartnersOfCurrentCity) {
        dataToWorkWith = this.getPartnersOfCurrentCity.sodexoPartners;
      } else {
        return;
      }

      // default loading amount 25
      let loadDataAmount = 25;
      // if the rest data to be loaded is less than the default amount, adjust to not load empty items
      if (
        dataToWorkWith.length -
          this.infiniteScrollCityData.sodexoPartners.length <=
        loadDataAmount
      ) {
        loadDataAmount =
          dataToWorkWith.length -
          this.infiniteScrollCityData.sodexoPartners.length;
      }
      const max =
        this.infiniteScrollCityData.sodexoPartners.length + loadDataAmount;
      const min = max - loadDataAmount;
      for (let x = min; x < max; x++) {
        this.infiniteScrollCityData.sodexoPartners.push(dataToWorkWith[x]);
      }
      if (event) {
        event.target.complete();
      }
      // if we have loaded all available data disabled infinite loading event
      if (
        this.infiniteScrollCityData.sodexoPartners.length >=
        dataToWorkWith.length
      ) {
        this.infiniteScrollIsDisabled = true;
      }
    },
    resetInfiniteScrollData() {
      this.infiniteScrollCityData.sodexoPartners = [];
      this.loadInfiniteScrollData();
      this.infiniteScrollIsDisabled = false;
    },
  },
};
</script>
