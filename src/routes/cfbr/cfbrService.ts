import { cfbDataApiRoutes } from "../../constants/cfb_data_api_routes";

export const getAllTeams = async () => {
  const res = await fetch(cfbDataApiRoutes.teams, {
    headers: {
      Authorization: `Bearer ${process.env.CFB_DATA_API_KEY}`,
    },
  });

  const data = await res.json();

  console.log(data);
};
