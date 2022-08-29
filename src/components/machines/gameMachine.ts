import create from "zustand"
import xstate from "zustand-middleware-xstate"
import { assign, createMachine } from "xstate"
import * as SplashScreen from "expo-splash-screen"
import * as Font from "expo-font"
import { FrederickatheGreat_400Regular } from "@expo-google-fonts/fredericka-the-great"

export type StateType = {
  targetNumber: number
  isGameModalOpen: boolean
  guessRange: {
    highNumber: number
    lowNumber: number
  }
  guessedNumbers: number[]
  isWinner: boolean
}

export type MachineEvents =
  | { type: "typeNumber"; value: number }
  | { type: "submitNumber" }
  | { type: "restartGame" }
  | { type: "selectHighOrLow"; setLow?: number; setHigh?: number }

type ServiceType = { loadFonts: { data: boolean } }

const initialState: StateType = {
  targetNumber: 0,
  isGameModalOpen: false,
  guessRange: {
    highNumber: 99,
    lowNumber: 0
  },
  guessedNumbers: [],
  isWinner: false
}

const gameMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswFkUGMAWAlgHZgB0aAngCoCuATkQMSxgA2YOALgBIFR4B5OgBkA9gHdEoAA6jYBTgVFEpIAB6IAjACYArAAZSATgDsADgBs+0wBYdR-SYA0ICom0BmC6R0Wj2kwsvGwDdMwBfcJdUDGx8YjIcUTRpGk4wOloGRlVZeUVlVQ0ETRszE1I-II8TRyNNIxsLFzcEL29S-V1NXSNGvobI6PQsXEISUhiwAFEiCEY6OE4UOk4AcRHcuQUlFSR1LRMQn00zD3OPTSuzLpbEAFpNLsrzPt0rfX0veqGQKbjxmQWOwuFQVjBOAA5GhoABGGWYNFhaAU0LhGS2+V2RS0jgqNg8NhMBm09RCQTuCEspE+RgsRP0Zm05X0Fgsv3+YwSpGBHE4YLoELR8LojE4FGkYGFGP2eR2hX2xU6Zkqjn0NjpAQseiMlMeKrMNk+1k8jnOJg5IwB3JQ0mkYhQEGIUEYEGUZGIADdRABrMic+ITW320SO50IL2iHAoApEADa+gAupj5XtQErHCqbAYatp6WYmf49b5SLoTIE89riR5IlEQERRBA4KoA4DyNR6GmQHLYziStYKg0AgTdB5WYaPJTtEbjBYwlUjaEmpbYlyJkkUmkMlkuz3sYqtETNKQjXVSto9Hop3ZSLUgmXy3SDOWV6NA-6RrMICneweSiZSVLL4L30bRPg8XRdEpDxTB8QldFCTQYN6TRX2tCZeVBcEwChGERR-fd01xcxKjKQkTDpU4LE0PUAjgkIQjLBozQvNC1zIYMHSdIgoAIhUiP7Q1bxMK5SSMAxLGZWiDGEhCznqDxDUGOtWwSPiuwzUcT3IkkyTzSdXAeDwL1vGwjUJdVhx+WsgA */
  createMachine(
    {
      context: { ...initialState },
      tsTypes: {} as import("./gameMachine.typegen").Typegen0,
      schema: {
        context: {} as StateType,
        events: {} as MachineEvents,
        services: {} as ServiceType
      },
      predictableActionArguments: true,
      id: "gameMachine",
      initial: "appLoading",
      states: {
        myTurn: {
          on: {
            selectHighOrLow: {
              actions: "setNewGuessRange",
              target: "computerTurn"
            }
          }
        },
        computerTurn: {
          entry: "computerGuess",
          always: [
            {
              cond: "correctGuess",
              target: "gameEnd"
            },
            {
              target: "myTurn"
            }
          ]
        },
        gameEnd: {
          entry: "setWinner",
          on: {
            restartGame: {
              actions: "resetState",
              target: "selectTargetNumber"
            }
          }
        },
        selectTargetNumber: {
          on: {
            submitNumber: {
              actions: ["openGameModal", "computerGuess"],
              target: "myTurn"
            },
            typeNumber: {
              actions: "updateTargetNumber"
            }
          }
        },
        appLoading: {
          invoke: {
            src: "loadFonts",
            onDone: [
              {
                target: "selectTargetNumber"
              }
            ]
          }
        }
      }
    },
    {
      actions: {
        resetState: assign((ctx) => {
          return initialState
        }),
        computerGuess: assign({
          guessedNumbers: (
            { guessRange: { highNumber, lowNumber }, guessedNumbers },
            event
          ) => {
            const guessedNumber = Math.floor(
              Math.random() * (highNumber - lowNumber) + lowNumber
            )
            return [guessedNumber, ...guessedNumbers]
          }
        }),
        openGameModal: assign({
          isGameModalOpen: (context) => true
        }),
        updateTargetNumber: assign({
          targetNumber: (context, event) => event.value
        }),
        setNewGuessRange: assign({
          guessRange: (context, event) => {
            const high = event?.setHigh || context.guessRange.highNumber
            const low = event?.setLow || context.guessRange.lowNumber
            return { highNumber: high, lowNumber: low }
          }
        }),
        setWinner: assign({
          isWinner: (ctx) => true
        })
      },
      guards: {
        correctGuess: (context) => {
          const isWinner = context.guessedNumbers[0] === context.targetNumber
          return isWinner
        }
      },
      services: {
        loadFonts: async () => {
          await Font.loadAsync({ frederick: FrederickatheGreat_400Regular })
          SplashScreen.hideAsync()

          return true
        }
      }
    }
  )
export const useGameMachineStore = create(xstate(gameMachine))
