import { StatusBar } from "expo-status-bar"
import React, { useReducer } from "react"
import { createMachine } from "xstate"
import {
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native"
import { useMachine } from "@xstate/react"

type StateType = {
  targetNumber: number
  isModalOpen: boolean
  highNumber: number
  lowNumber: number
  guessedNumbers: number[]
  isWinner: boolean
}

type ActionTypes =
  | {
      type: "guessNumber"
      payload?: null
    }
  | {
      type: "toggleModal"
      payload: boolean
    }
  | {
      type: "setNumber"
      payload: number
    }
  | {
      type: "setLowHigh"
      payload: { low?: number; high?: number }
    }
  | {
      type: "checkWinner"
      payload?: null
    }

const initialState: StateType = {
  targetNumber: 0,
  isModalOpen: false,
  highNumber: 99,
  lowNumber: 0,
  guessedNumbers: [],
  isWinner: false
}

const gameMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswFkUGMAWAlgHZgB0qGAymAC4CuADgMQkDuA4umIqAwPawCNAnyI8QAD0QBaAGykAHAFZZSpQE4AzJoUB2XQCZN69QBoQATxkAWBaU0BGWY+tLdABlm6HBpQF8-cwosXEISUjQLABU6ACciJlgwABswHBoACQIoPDBY8X5BYVFxKQQld2tSA101BVkFBVdZd01dcysEaQcq9w9NJQUdd3VZVS8AoK5sfGIySJj4xJS0mgAZPlY8goEhETEkSURrEdJ3FRN1BwVfBXUlDsQtaqUDetkjQc9ZB0mQYJmYTIOD4aAYNDyiwSOyK+1KiCUpGcSmstVkJzGPnUCkeCE07gMihUPV01hJvnUfwBoTm5C4AFEiBAmLE4DQULEaJwMDC9iVDmVpAZWtVUQ11AYHA5WoZcXpSG5pVo3ASPs4qdMaeEkql0lEOTAaAA5OhoABGeUSdDNaCEJvN20OhT5B1AZQcmiqN0M1jeyla93alhkPiqhlajQchiMxl0AUCICIfAgcHE1Nm4WC1HoDF5xVdRy6Rnc9l0XgUDjcwoM1gluOk8vJJI+Wgc2I1GEBtIWcQLzvz8LxNdIpPR+l0OnUlVk9dJ9lR1x+nmszkMHZCGeBoPBkN7ebhAuOp2Uukaxk0LQ0OODCBODiRqhVY7bFes667mYZTP3-LdIbLI4KOc0p3KSgz3LiBgGPIlayPc2gtL4KJvgm6ZAqQOqrPqsSGvaFr5E6uwDoeCB2CutjQToqgei0QadCoI4Sk4PzeBWkoqO+WrcIRsK-oWQooqW5aVuGNZ1je3SjEidyVp6JzKFOmjxn4QA */
  createMachine(
    {
      context: { computerGuesses: [] as number[] },
      tsTypes: {} as import("./App.typegen").Typegen0,
      predictableActionArguments: true,
      id: "gameMachine",
      initial: "gameSetup",
      states: {
        gameSetup: {
          entry: "resetState",
          on: {
            newGame: {
              target: "selectTargetNumber"
            }
          }
        },
        myTurn: {
          on: {
            selectHigher: {
              target: "compterTurn"
            },
            selectLower: {
              target: "compterTurn"
            }
          }
        },
        compterTurn: {
          entry: "computerGuess",
          always: [
            {
              cond: "correct guess",
              target: "gameEnd"
            },
            {
              cond: "incorrect guess",
              target: "myTurn"
            }
          ]
        },
        gameEnd: {
          on: {
            restartGame: {
              target: "gameSetup"
            }
          }
        },
        selectTargetNumber: {
          on: {
            submitNumber: {
              target: "myTurn"
            }
          }
        }
      }
    },
    {
      actions: {
        resetState: () => {
          console.log("state is reset")
        },
        computerGuess(context, event, meta) {}
      },
      guards: {
        "correct guess": () => {
          return true
        },
        "incorrect guess": () => true
      }
    }
  )

export default function App() {
  const [state, send] = useMachine(gameMachine)
  const [{ targetNumber, isWinner, isModalOpen, guessedNumbers }, dispatch] =
    useReducer(
      (state: StateType, { type, payload }: ActionTypes): StateType => {
        const { lowNumber, highNumber, guessedNumbers, isWinner } = state
        switch (type) {
          case "guessNumber":
            const guessedNumber = Math.floor(
              Math.random() * (highNumber - lowNumber + 1) + lowNumber
            )
            return {
              ...state,
              guessedNumbers: [guessedNumber, ...guessedNumbers]
            }
          case "toggleModal":
            return { ...state, isModalOpen: payload }
          case "setNumber":
            return { ...state, targetNumber: payload }
          case "setLowHigh":
            const low = payload.low || lowNumber
            const high = payload.high || highNumber
            return { ...state, lowNumber: low, highNumber: high }
          case "checkWinner":
            if (guessedNumbers[0] === targetNumber) {
              return { ...state, isWinner: true }
            } else {
              return { ...state }
            }
          default:
            return state
        }
      },
      initialState
    )

  const handleSubmitNumber = () => {
    dispatch({ type: "guessNumber" })
    dispatch({ type: "toggleModal", payload: true })
  }

  const handleNumberIsHigher = () => {
    dispatch({ type: "setLowHigh", payload: { low: guessedNumbers[0] } })
    dispatch({ type: "guessNumber" })
  }

  const handleNumberIsLower = () => {
    dispatch({ type: "setLowHigh", payload: { high: guessedNumbers[0] } })
    dispatch({ type: "guessNumber" })
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View>
        <Text>Enter a number between 0-99</Text>
        <TextInput
          keyboardType="numeric"
          placeholder="Enter number"
          maxLength={2}
          value={targetNumber.toString()}
          onChangeText={(text) => {
            dispatch({ type: "setNumber", payload: Number(text) })
          }}
        />
        <Button title="Go" onPress={handleSubmitNumber} />
        <Modal visible={isModalOpen} animationType="slide">
          <View>
            <Text>My number: {targetNumber}</Text>
            <Text>Guessed number: {guessedNumbers[0]} </Text>
            <Pressable
              style={styles.hiLowButtons}
              android_ripple={{ color: "#f05" }}
              onPress={handleNumberIsHigher}
            >
              <Text style={styles.hiLowButtonsText}>Higher</Text>
            </Pressable>
            <Button title="lower" onPress={handleNumberIsLower} />
            {guessedNumbers.slice(1).map((guess, i) => {
              return <Text key={i}>Guess: {guess}</Text>
            })}
          </View>
          <Modal visible={isWinner}>
            <View>
              <Text>winner</Text>
            </View>
          </Modal>
        </Modal>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  hiLowButtons: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f"
  },
  hiLowButtonsText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    textTransform: "uppercase"
  }
})
