// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
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
    resetState: "restartGame" | "xstate.init";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    correct: "computerGuess";
    guessAgain: "computerGuess";
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
