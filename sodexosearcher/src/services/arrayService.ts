//https://stackoverflow.com/questions/33356504/difference-and-intersection-of-two-arrays-containing-objects
// maybe I should start using lodash?

function operation(list1: any[], list2: any[], propertyToCompare: string, isUnion = false): any[] {
    return list1.filter(a => isUnion === list2.some(b => a[propertyToCompare] === b[propertyToCompare]));
}

export class ArrayCompareService {
   inBoth(list1: any[], list2: any[], propertyToCompare: string): any[] {
        return operation(list1, list2, propertyToCompare, true);
   }
   inFirstOnly(list1: any[], list2: any[], propertyToCompare: string): any[] {
       return operation(list1, list2, propertyToCompare);
   }
   inSecondOnly(list1: any[], list2: any[], propertyToCompare: string): any[] {
       return operation(list2, list1, propertyToCompare);
   }
}