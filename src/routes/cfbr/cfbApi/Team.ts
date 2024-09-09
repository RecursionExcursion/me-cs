import { RankableStats } from "./stats";

export class Team {
  id: number;
  school: School;
  schedule: number[];
  stats: RankableStats;
  weight: number | undefined;

  constructor(school: School) {
    this.id = school.id;
    this.school = school;
    this.schedule = [];
    this.stats = createStats();
  }
}

export type School = {
  id: number;
  school: string;
  mascot: string;
  abbreviation: string;
  alt_name1: string;
  alt_name2: string;
  alt_name3: string;
  conference: string;
  division: string;
  color: string;
  alt_color: string;
  logos: string[];
  twitter: string;
  location: SchoolLocation;
};

export type SchoolLocation = {
  venue_id: number;
  name: string;
  city: string;
  state: string;
  zip: string;
  country_code: string;
  timezone: string;
  latitude: number;
  longitude: number;
  elevation: string;
  capacity: number;
  year_constructed: number;
  grass: boolean;
  dome: boolean;
};

function createStats(): RankableStats {
  return {
    offense: 0,
    defense: 0,
    pointsFor: 0,
    pointsAllowed: 0,
  };
}
