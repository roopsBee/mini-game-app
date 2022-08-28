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
    computerGuess: "selectHighOrLow" | "submitNumber";
    openGameModal: "submitNumber";
    resetState: "restartGame";
    setNewGuessRange: "selectHighOrLow";
    setWinner: "";
    updateTargetNumber: "typeNumber";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    correctGuess: "";
  };
  eventsCausingDelays: {};
  matchesStates: "computerTurn" | "gameEnd" | "myTurn" | "selectTargetNumber";
  tags: never;
}
