export type SeasonType = "regular" | "postseason";
export type Division = "fbs" | "fcs" | "ii" | "iii";

export class CfbApiRequestBuilder {
  /* Could move all this to constructor to make this more generic and reuseable */
  private baseRoute = "https://api.collegefootballdata.com";

  private teamsRoute = `/teams/fbs`;
  private gamesRoute = `/games`;
  private statsRoute = `/games/teams`;

  private year: number;

  public constructor(year: number) {
    this.year = year;
  }

  public async getTeams() {
    const queryParams = {
      year: `year=${this.year}`,
    };

    const path = RequestStringBuilder.create(
      this.baseRoute,
      this.teamsRoute,
      queryParams
    );

    return await this.fetchRoute(path);
  }

  public async getGames(seasonType?: SeasonType, division?: Division) {
    const queryParams = {
      division: `division=${division ?? "fbs"}`,
      year: `year=${this.year}`,
      seasonType: `seasonType=${seasonType ?? "regular"}`,
    };

    const path = RequestStringBuilder.create(
      this.baseRoute,
      this.gamesRoute,
      queryParams
    );

    return this.fetchRoute(path);
  }

  public async getStats(week: number, seasonType?: SeasonType) {
    const queryParams = {
      year: `year=${this.year}`,
      week: `week=${week}`,
      seasonType: `seasonType=${seasonType ?? "regular"}`,
    };

    const path = RequestStringBuilder.create(
      this.baseRoute,
      this.statsRoute,
      queryParams
    );
    return this.fetchRoute(path);
  }

  private async fetchRoute(route: string) {
    return await fetch(route, {
      headers: {
        Authorization: `Bearer ${process.env.CFB_DATA_API_KEY}`,
      },
    });
  }
}

class RequestStringBuilder {
  public static create(
    baseRoute: string,
    route: string,
    queryParams: Record<string, string>
  ) {
    const queryString = this.createQueryString(queryParams);
    return this.appendRoutes(baseRoute, route, queryString);
  }

  private static createQueryString(params: Record<string, string>) {
    return `?${Object.values(params).join("&")}`;
  }

  private static appendRoutes(...routes: string[]) {
    return routes.join("");
  }
}
