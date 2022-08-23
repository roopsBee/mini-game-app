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
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswFkUGMAWAlgHZgB0qGAymAC4CuADgMQkDuA4umIqAwPawCNAnyI8QAD0QBaAIwBWAGykAnAAYAHABYNAJg0qAzLvlaA7IoA0IAJ4zDh0scOLDB2YrULF8gL6-rCixcQhJSNBsAFToAJyImWDAAGzAcGgAJAig8MBjxfkFhUXEpBENTUl1dF1cHNTUzDWs7BDVVKsNZM10zFwM1TpV-QK5sfGIyCOi4hOTUmgAZPlZc-IEhETEkSUQTFVJ6+QalfVkG2S1mxDONSq15U1l+rUUq4ZAgsdCyHD40BhouWm8V+-zogJi7DocHg2wKG2K21Kcl0bXkCjU8mM8jMZhUuN0VwQ+i0qk8ihUqI0jTUKgU70+IQm5C4AFEiBAmDE4DQUDEaJwMGtCpsSvYsZUVCpFLIej50SolESzrpSEpDBZKbotHS9IYGaMmWFEik0pE+TAaAA5OhoABGuQSdDtaCENvtqzh6yKW1AyLMpC0WjUPXkofk1IGROknnaFka8ilR10slk-gCICIfAgcHEjPGYSC1HoDGFCN9OwQ0jcbS0+jMmNlPgahmj3VICnuhjpmjlbgNGC+zKmsQr8J9YoQXVJFPuj20daqVlsMkTTlM6LU9yemllfgz+e+pFBAKBo7LE6RiEMwacWguqO6PUMXmXLRTqrOdIeshv3VlA7BAWZBBOyEAXqKV5VsYygaMYWg3tuKj3q2K7EveHY6q86gXHSZyKIBQ7GnMZoWrQ7oOnkXoioifoyBcshqpG+IeHiijUvIRJmIxjQ6PeeiKC8uL7iMg5Gtw1HlpO0jBqSdaRuiujNr00YXKSsrGNKryPlo6a+EAA */
  createMachine(
    {
      predictableActionArguments: true,
      tsTypes: {} as import("./App.typegen").Typegen0,
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
          on: {
            computerGuess: [
              {
                cond: "correct",
                target: "gameEnd"
              },
              {
                cond: "guessAgain",
                target: "myTurn"
              }
            ]
          }
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
        }
      },
      guards: {
        correct: () => {
          return true
        },
        guessAgain: () => true
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
