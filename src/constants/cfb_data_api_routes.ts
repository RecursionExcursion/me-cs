//TODO Decouple query params from the routes

const base = "https://api.collegefootballdata.com";
const teams = "/teams/fbs?year=2024";

export const cfbDataApiRoutes = {
  teams: `${base}${teams}`,
};
