// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    computerGuess: "selectHigher" | "selectLower";
    resetState: "restartGame" | "xstate.init";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    "correct guess": "";
    "incorrect guess": "";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "compterTurn"
    | "gameEnd"
    | "gameSetup"
    | "myTurn"
    | "selectTargetNumber";
  tags: never;
}
