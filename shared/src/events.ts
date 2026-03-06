export type MatchEventType =
  | "match.ball_added"
  | "match.score_updated"
  | "match.wicket"
  | "match.over_complete"
  | "match.innings_end"
  | "match.innings_switch"
  | "match.match_complete"
  | "match.milestone"
  | "match.partnership_update"
  | "match.batsman_change"
  | "match.bowler_change";

export interface MatchEvent {
  eventType: MatchEventType;
  matchId: string;
  timestamp: string;
  correlationId: string;
  payload: MatchEventPayload;
}

// --- Payload types per event ---

export interface BallAddedPayload {
  innings: number;
  over: number;
  ball: number;
  runsOffBat: number;
  extraRuns: number;
  isWicket: boolean;
  boundary: string | null;
  isWide: boolean;
  isNoBall: boolean;
}

export interface ScoreUpdatedPayload {
  teamId: string;
  runs: number;
  wickets: number;
  overs: number;
  striker: {
    id: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
  };
  nonStriker: {
    id: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
  };
  bowler: {
    id: string;
    balls: number;
    overs: number;
    runsConceded: number;
    wickets: number;
    economy: number;
  };
}

export interface WicketPayload {
  wicketType: string;
  dismissedPlayerId: string;
  wicketNumber: number;
  runsAtFall: number;
  over: number;
  ball: number;
}

export interface OverCompletePayload {
  innings: number;
  over: number;
  runs: number;
  wickets: number;
  extras: number;
}

export interface InningsEndPayload {
  innings: number;
  reason: string;
  target?: number;
}

export interface InningsSwitchPayload {
  newInnings: number;
}

export interface MatchCompletePayload {
  result: string;
  winnerTeamId: string | null;
  resultMethod: string;
  resultMargin: number;
}

export interface MilestonePayload {
  playerId: string;
  milestoneType: string;
  milestoneValue: number;
  over: number;
  ball: number;
}

export interface PartnershipUpdatePayload {
  batter1Id: string;
  batter2Id: string;
  runs: number;
  balls: number;
}

export interface BatsmanChangePayload {
  newBatsmanId: string;
  position: "STRIKER" | "NON_STRIKER";
}

export interface BowlerChangePayload {
  bowlerId: string;
  over: number;
}

export type MatchEventPayload =
  | BallAddedPayload
  | ScoreUpdatedPayload
  | WicketPayload
  | OverCompletePayload
  | InningsEndPayload
  | InningsSwitchPayload
  | MatchCompletePayload
  | MilestonePayload
  | PartnershipUpdatePayload
  | BatsmanChangePayload
  | BowlerChangePayload;