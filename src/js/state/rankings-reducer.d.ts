import {RankingsSnapshot} from "../rankings-snapshot";
import {Action, Rankings} from "./state";

export declare function setRankingsDataAction(rankingsSnapshot: RankingsSnapshot): Action
export declare function rankingsReducer(rankings: Rankings, action: Action): Rankings