import fs from "fs";
import path from "path";
import { Cache } from "./cacheInterface";

const WORKING_DIR = process.cwd();
const LOCAL_CACHE_FOLDER = "localCache";

type CachableResponse = {
  games: unknown;
  teams: unknown;
  stats: unknown;
};

const inMemoryCache = {
  season: new Map<number, CachableResponse>(),
};

export class LocalCache implements Cache<number, CachableResponse> {
  #CACHE_DIR = path.resolve(WORKING_DIR, LOCAL_CACHE_FOLDER);

  constructor() {
    this.#init();
  }

  public getVirtualCache() {
    return inMemoryCache;
  }

  #init() {
    if (!fs.existsSync(this.#CACHE_DIR)) {
      fs.mkdirSync(this.#CACHE_DIR);
    }
  }

  check(key: number): boolean {
    return fs.existsSync(path.resolve(this.#CACHE_DIR, `${key}.json`));
  }

  save(data: CachableResponse, name: string): void {
    fs.writeFileSync(
      path.resolve(this.#CACHE_DIR, `${name}.json`),
      JSON.stringify(data),
      "utf-8"
    );
  }

  load(key: number) {
    if (!inMemoryCache.season.has(key)) {
      const data = fs.readFileSync(
        path.resolve(this.#CACHE_DIR, `${key}.json`),
        "utf-8"
      );
      inMemoryCache.season.set(key, JSON.parse(data));
    }

    return inMemoryCache.season.get(key)!;
  }
}
