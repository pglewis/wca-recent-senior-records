// @ts-check
import {RankingsSnapshot} from "../rankings-snapshot";
import {Action, RankingsDataSetAction} from "./actions";
import {Rankings} from "./state";

export declare function setRankingsDataAction(rankingsSnapshot: RankingsSnapshot): RankingsDataSetAction;
export declare function rankingsReducer(rankings: Rankings, action: Action): Rankings;
