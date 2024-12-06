import { RequestBuilder } from "./RequestBuilder";

export type SeasonType = "regular" | "postseason";
export type Division = "fbs" | "fcs" | "ii" | "iii";

export class CfbApiRequestExecutor {
  /*TODO: Could move all this to constructor to make this more generic and reuseable */

  #routes = {
    base: "https://api.collegefootballdata.com",
    teams: "/teams/fbs",
    games: "/games",
    stats: "/games/teams",
  };

  private year: number;

  public constructor(year: number) {
    this.year = year;
  }

  public async getTeams() {
    const queryParams = {
      year: `year=${this.year}`,
    };

    const path = new RequestBuilder()
      .baseUrl(this.#routes.base)
      .route(this.#routes.teams)
      .queryParams(queryParams)
      .build();

    return await this.#fetchRoute(path);
  }

  public async getGames(seasonType?: SeasonType, division?: Division) {
    const queryParams = {
      division: `division=${division ?? "fbs"}`,
      year: `year=${this.year}`,
      seasonType: `seasonType=${seasonType ?? "regular"}`,
    };

    const path = new RequestBuilder()
      .baseUrl(this.#routes.base)
      .route(this.#routes.games)
      .queryParams(queryParams)
      .build();

    return this.#fetchRoute(path);
  }

  public async getStats(week: number, seasonType?: SeasonType) {
    const queryParams = {
      year: `year=${this.year}`,
      week: `week=${week}`,
      seasonType: `seasonType=${seasonType ?? "regular"}`,
    };

    const path = new RequestBuilder()
      .baseUrl(this.#routes.base)
      .route(this.#routes.stats)
      .queryParams(queryParams)
      .build();

    return this.#fetchRoute(path);
  }

  async #fetchRoute(route: string) {
    return await fetch(route, {
      headers: {
        Authorization: `Bearer ${process.env.CFB_DATA_API_KEY}`,
      },
    });
  }
}
