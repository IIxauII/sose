import { CityWithPartner, Partner } from "@/model/partners";
import { SortInputDistance, SortInputName } from "@/model/sort";

export class SortService {
    sortByName(payload: SortInputName[]): SortInputName[] {
        return payload.sort((a: SortInputName, b: SortInputName) => a.name.localeCompare(b.name));
    }
    sortByDistance(payload: SortInputDistance[]): SortInputDistance[]  {
        return payload.sort((a: SortInputDistance, b: SortInputDistance) => a.distance - b.distance);
    }
}