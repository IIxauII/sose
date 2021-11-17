import { distanceCalcInput } from "@/model/distance";

export class DistanceService {
    calculateDistance(payload: distanceCalcInput): number {
        const lat2 = payload.otherLocation.lat;
        const lng2 = payload.otherLocation.lng;
        const p = 0.017453292519943295;    // Math.PI / 180
        const c = Math.cos;
        const a = 0.5 - c((lat2 - payload.myLocation.lat) * p)/2 + 
                c(payload.myLocation.lat * p) * c(lat2 * p) * 
                (1 - c((lng2 - payload.myLocation.lng) * p))/2;
    
        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }
    roundCityData(payload: number): number {
        if (payload > 2) {
            return Math.round(payload);
        } else {
            return Math.round(payload * 10) / 10;
        }
    }
}