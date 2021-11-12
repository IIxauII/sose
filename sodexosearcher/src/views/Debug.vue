<template>
  <ion-page>
        <default-header
            headerTitle='Debug'
        ></default-header>
        <ion-content fullscreen>
            <ion-list-header>
                <ion-label>Data</ion-label>
                <ion-button
                    @click="buttonClicked(buttons.dataList.name)"
                >{{ buttons.dataList.state ? text.hide : text.show }}</ion-button>
            </ion-list-header>
            <ion-list
                v-if="buttons.dataList.state"
            >
                <ion-item
                    v-for="(data, index) in getData"
                    v-bind:key="index"
                >{{ data }}</ion-item>
            </ion-list>
            <ion-list-header>
                <ion-label>Debug</ion-label>
                <ion-button
                    @click="buttonClicked(buttons.debugList.name)"
                >{{ buttons.debugList.state ? text.hide : text.show }}</ion-button>
            </ion-list-header>
            <ion-list
                v-if="buttons.debugList.state"
            >
                <ion-item
                    v-for="(data, index) in getDebug"
                    v-bind:key="index"
                >{{ data }}</ion-item>
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
    IonItem,
} from '@ionic/vue';
import DefaultHeader from "../components/global/DefaultHeader.vue"
import { mapGetters } from 'vuex';

export default {
    name: 'Debug',
    components: {
        DefaultHeader,
        IonPage,
        IonContent,
        IonList,
        IonListHeader,
        IonLabel,
        IonItem,
    },
    data() {
        return {
            text: {
                show: 'Show',
                hide: 'Hide',
            },
            buttons: {
                dataList: {
                    state: false,
                    name: 'dataList',
                },
                debugList: {
                    state: false,
                    name: 'debugList',
                }
            },
        }
    },
    mounted() {
        console.log('Mounted Debug!');
    },
    computed: {
        ...mapGetters('debug', {
            getData: 'getData',
            getDebug: 'getDebug',
        }),
    },
    methods: {
        buttonClicked(buttonName) {
            this.buttons[buttonName].state = !this.buttons[buttonName].state;
        }
    },
}
</script>

<style>

</style>