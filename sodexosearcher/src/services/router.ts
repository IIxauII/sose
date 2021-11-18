import router from '@/router';

export class RouterService {
    isCitiesRoute(): boolean {
        console.log('isCitiesRoute', router.currentRoute.value.fullPath === '/tabs/tab2');
        return router.currentRoute.value.fullPath === '/tabs/tab2';
    }
    isCityDetailsRouter(): boolean {
        return false;
    }
}