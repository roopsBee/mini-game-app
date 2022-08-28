import React from "react"
import create from "zustand"
import xstate from "zustand-middleware-xstate"
import { assign, createMachine } from "xstate"

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
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswFkUGMAWAlgHZgB0aAngCoCuATkQMSxgA2YOALgBIFR4B5OgBkA9gHdEoAA6jYBTgVFEpIAB6IAjAAYAHADZSATgDsu3doCsmowGZdmkwBYANCAqJbAJm2lNur0svJwD9J01LXVsAX2i3VAxsfGIyHFE0aRpOMDpaBkZVWXlFZVUNBE1bPVJbE1tLbTNLfT0otw8EJ31DcK8vfUdLZutbJ1j49CxcQhJSBLAAUSIIRjo4ThQ6TgBxScK5BSUVJHUtZq9SEyMh7SdWxtd3RABaO1JdM0GvE30qk0sTOMQPMkjMyCx2FwqJsYJwAHI0NAAIxyzBoSLQCgRyJy+2KRzKiCM-VIAOatm64QizXaWiuxicliMRhaVlGJi8QJB0xSpAhHE40LosOxKLojE4FGkYFFuJORUOpRO5U0fSMpC8uicfVut2sRkeHWeJlI2lsRn8uiMjW0t3qRlicRARFEEDgqm5yVmlDyxxkBxKftOCGu6t0zQtI2pFNpCG8Jv0Q004XCFLumi5k1BvLSGSyOV9eMVQZVXmJppMVzCxOTLNjVV0fmttmTNh0zjGTs9YLmkyWECLgcJFTJGqslm1LV++i8sZChitVycjK1ziumcSPNm-KhMLA8MRYsHBOViCt6u8SY+9n+TlsseeERqtlGfWCDkrRgCG6mXrAx6VUByg+SwakCaxrxAu8H00RN3i6GtYLCClakdaIgA */
  createMachine(
    {
      context: { ...initialState },
      tsTypes: {} as import("./gameMachine.typegen").Typegen0,
      schema: { context: {} as StateType, events: {} as MachineEvents },
      predictableActionArguments: true,
      id: "gameMachine",
      initial: "selectTargetNumber",
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
        }
      }
    },
    {
      actions: {
        resetState: assign((ctx) => {
          console.log(ctx)

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
      }
    }
  )
export const useGameMachineStore = create(xstate(gameMachine))
