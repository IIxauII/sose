export enum StorageKeys {
    CITIES = 'cities',
    CITIESWITHPARTNERS = 'citiesWithPartners',
    GEO = 'geo',
}

export enum StorageStrings {
    TIMESTAMPSUFFIX = '-timeStamp',
}

export enum StorageItemLifeSpan {
    TEST = 10000,
    // 1000 * 60 * 60 * 24 = 86400000 (1 day in ms)
    CITIES = 86400000,
    CITIESWITHPARTNERS = 86400000,
    GEO = 30000,
}
