import { SearchInput } from "@/model/search";

export class SearchService {
    // output needs to be casted
    filterByName(filterString: string, toBeFiltered: SearchInput[]): SearchInput[] {
        filterString = filterString.toLowerCase();
        
        return toBeFiltered.filter((data: SearchInput) => {
            data.name.toLowerCase().includes(filterString);
        });
    }
}