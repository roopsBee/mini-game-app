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
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswFkUGMAWAlgHZgB0aAngCoCuATkQMSxgA2YOALgBIFR4B5OgBkA9gHdEoAA6jYBTgVFEpIAB6IAjJoDMADlJ6ArACYjRvQDYdAFgDsNowBoQFLXc2kTATiN3bmr7+ejZ6AL5hLqgY2PjEZDiiaNI0nGB0tAyMqrLyisqqGgi6dkakfgAMJsbediaWNt4ubgg6FZ5t3jomZkY2bdURUehYuIQkpNFgAKJEEIx0cJwodJwA4iM5cgpKKkjqWpY+pN7ePXo9FTbWjc2IALSadhXlmu163lcVdZZDIFOxcZkFjsLhUFYwTgAORoaAARulmDQ4WgFDD4ektnldoVEN5LGU2lZTpoQno9N87ggTJ4niEjDoGjS9JpzH8AWN4qQQRxOOC6JD0Qi6IxOBRpGAhZj9rkdgV9kVND5LKRQhVTsYaRUKSYqfc9DpSJYPCYqsbNDZzuyRoCuShpNIxCgIMQoIwIMoyMQAG6iADWZA5cQm9sdomdroQPtEOBQ+SIAG0KgBdLFyvagIr4lXdfo0vrnHTOVwPQKeGzai4VCqWC5liKREBEUQQOCqINA8jUegZkCy+O4hDeYykGuWSxnS02XRWKlPFW6a52SyBXxWIvWmKciaJZKpdKZXv9nEKrRF7xeBwOCo6Vm1M5z5eGUqaBo6fT4192TejYOBkazBAaYDqexQrnYpA6HYHgTuq+jqrqJatN0kE3u+Fb+CY36Nh2XI8mCEJgNCsLCsBJ6Zni47lD0yrGAyrI6Hq3iePifSMu0Zj4v0P62iGDpOi6RBQGR8oUUOdRGo43zkjY-RPJoeq3mUlg1vY-h9Ay6rYcMW5-iJvZZtOqHEsxZIUnYil6BBfimLepTmN0RgNmEQA */
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
