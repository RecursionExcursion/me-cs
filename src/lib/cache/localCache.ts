import fs from "fs";
import path from "path";
import { Season } from "../old/cfbr/Season";
import { Cache } from "./cache";

const WORKING_DIR = process.cwd();
const LOCAL_CACHE_FOLDER = "localCache";

const inMemoryCache = {
  season: new Map<number, Season>(),
};

export class LocalCache implements Cache {
  #CACHE_DIR = path.resolve(WORKING_DIR, LOCAL_CACHE_FOLDER);

  constructor() {
    this.#initDir();
  }

  public async get(year: number) {
    //Not found in inMemCache
    if (!inMemoryCache.season.has(year)) {
      //Check if in fs
      if (!this.#seasonExistsInCache(year)) {
        console.log(`Season ${year} not found`);
        console.log("Caching...");
        //Season creation, this could be abstracted away if cache is to only handle storage/retrieval

        //Save to fs
        this.#cacheSeason(await Season.CreateSeason(year));
      }

      console.log(`Retrieving ${year} season from fs`);
      console.log(`Saving to mem cache`);
      //load into mem cache
      inMemoryCache.season.set(year, this.#retrieveSeason(year));
    }

    console.log(`Getting ${year} from mem cache`);

    //Get from mem cache
    return inMemoryCache.season.get(year)!;
  }

  #initDir() {
    if (!fs.existsSync(this.#CACHE_DIR)) {
      fs.mkdirSync(this.#CACHE_DIR);
    }
  }

  #cacheSeason(season: Season) {
    fs.writeFileSync(
      path.resolve(this.#CACHE_DIR, `${season.getYear()}.json`),
      season.toJson(),
      "utf-8"
    );
  }

  #seasonExistsInCache(year: number): boolean {
    return fs.existsSync(path.resolve(this.#CACHE_DIR, `${year}.json`));
  }

  #retrieveSeason(year: number) {
    const data = fs.readFileSync(
      path.resolve(this.#CACHE_DIR, `${year}.json`),
      "utf-8"
    );

    const plainSeason = JSON.parse(data);

    return new Season(
      year,
      new Map(plainSeason.teams),
      new Map(plainSeason.games)
    );
  }
}
