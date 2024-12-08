import { GameData } from "../../src/types/game";

type MockGameParams = {
  ids: {
    gameId: number;
    homeId: number;
    awayId: number;
  };
  stats: {
    week: number;
    homeScore: number;
    awayScore: number;
    homeYards: number;
    awayYards: number;
  };
};

export function createEmptyGame(props: MockGameParams): GameData {
  const gd: GameData = {
    id: props.ids.gameId,
    game: {
      id: props.ids.gameId,
      season: 0,
      week: props.stats.week,
      season_type: "",
      start_date: "",
      start_time_tbd: false,
      completed: true, //Marked true
      neutral_site: false,
      conference_game: false,
      attendance: null,
      venue_id: 0,
      venue: "",
      home_id: props.ids.homeId,
      home_team: "",
      home_conference: "",
      home_division: "",
      home_points: props.stats.homeScore,
      home_line_scores: [],
      home_post_win_prob: "",
      home_pregame_elo: 0,
      home_postgame_elo: 0,
      away_id: props.ids.awayId,
      away_team: "",
      away_conference: "",
      away_division: "",
      away_points: props.stats.awayScore,
      away_line_scores: [],
      away_post_win_prob: "",
      away_pregame_elo: 0,
      away_postgame_elo: 0,
      excitement_index: "",
      highlights: null,
      notes: "",
    },
    gameStats: {
      id: props.ids.gameId,
      teams: [
        {
          schoolId: props.ids.homeId,
          school: "",
          conference: "",
          homeAway: "home",
          points: props.stats.homeScore,
          stats: [
            {
              category: "",
              stat: "",
            },
          ],
        },
        {
          schoolId: props.ids.awayId,
          school: "",
          conference: "",
          homeAway: "away",
          points: props.stats.awayScore,
          stats: [
            {
              category: "",
              stat: "",
            },
          ],
        },
      ],
    },
  };

  gd.gameStats?.teams.forEach((t) => {
    t.stats.push({
      category: "totalYards",
      stat:
        t.homeAway === "home"
          ? props.stats.homeYards.toString()
          : props.stats.awayYards.toString(),
    });
  });

  return gd;
}
