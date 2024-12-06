import { Season } from "../old/cfbr/Season";
import { LocalCache } from "./localCache";

const DEFAULT_CACHE_ENV = "cloud";

// const caches = {
//   season: new Map<number, Season>(),
// };

export interface Cache {
  get(year: number): Promise<Season>;
}

export function cache() {
  const cacheEnv = process.env.CACHE_ENV ?? DEFAULT_CACHE_ENV;

  let cache: Cache;

  if (cacheEnv === "local") {
    cache = new LocalCache();
  } else {
    throw Error("Not implemented");
    cache = {} as Cache;
  }

  return cache;
}
