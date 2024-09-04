export type SeasonType = "regular" | "postseason";
export type Division = "fbs" | "fcs" | "ii" | "iii";

export class CfbApiQueryManager {
  private baseRoute = "https://api.collegefootballdata.com";

  private teamsRoute = `/teams/fbs`;
  private gamesRoute = `/games`;
  private statsRoute = `/games/teams`;

  private year: number;

  public constructor(year: number) {
    this.year = year;
  }

  public async getTeams() {
    const teamsQuery = this.teamsRoute + `?year=${this.year}`;
    const path = this.appendToBase(teamsQuery);
    return await this.fetchRoute(path);
  }

  public async getGames(seasonType?: SeasonType, division?: Division) {
    const queryParams = {
      division: `division=${division ?? "fbs"}`,
      year: `year=${this.year}`,
      seasonType: `seasonType=${seasonType ?? "regular"}`,
    };

    const queryString = `?${Object.values(queryParams).join("&")}`;

    const path = this.appendToBase(this.gamesRoute + queryString);
    return this.fetchRoute(path);
  }

  public async getStats(week: number, seasonType?: SeasonType) {
    const queryParams = {
      year: `year=${this.year}`,
      week: `week=${week}`,
      seasonType: `seasonType=${seasonType ?? "regular"}`,
    };
    const queryString = `?${Object.values(queryParams).join("&")}`;
    const path = this.appendToBase(this.statsRoute + queryString);
    return this.fetchRoute(path);
  }

  private appendToBase(route: string) {
    return `${this.baseRoute}${route}`;
  }

  private async fetchRoute(route: string) {
    return await fetch(route, {
      headers: {
        Authorization: `Bearer ${process.env.CFB_DATA_API_KEY}`,
      },
    });
  }
}
