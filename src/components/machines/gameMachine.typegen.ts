// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    loadFonts: "done.invoke.gameMachine.appLoading:invocation[0]";
  };
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
  eventsCausingServices: {
    loadFonts: "xstate.init";
  };
  eventsCausingGuards: {
    correctGuess: "";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "appLoading"
    | "computerTurn"
    | "gameEnd"
    | "myTurn"
    | "selectTargetNumber";
  tags: never;
}
