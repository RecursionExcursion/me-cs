import { School } from "../../src/types/Team";

type MockTeamParams = {
  id: number;
  name?: string;
  abbr?: string;
};

export function createEmptySchool(props: MockTeamParams): School {
  return {
    id: props.id,
    school: props.name ?? "",
    mascot: "",
    abbreviation: props.abbr ?? "",
    alt_name1: "",
    alt_name2: "",
    alt_name3: "",
    conference: "",
    division: "",
    color: "",
    alt_color: "",
    logos: [],
    twitter: "",
    location: {
      venue_id: 0,
      name: "",
      city: "",
      state: "",
      zip: "",
      country_code: "",
      timezone: "",
      latitude: 0,
      longitude: 0,
      elevation: "",
      capacity: 0,
      year_constructed: 0,
      grass: false,
      dome: false,
    },
  };
}
