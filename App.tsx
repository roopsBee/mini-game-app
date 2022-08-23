import { StatusBar } from "expo-status-bar"
import React, { useReducer, useState } from "react"
import {
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native"

type StateType = {
  targetNumber: number
  isModalOpen: boolean
  highNumber: number
  lowNumber: number
  guessedNumbers: number[]
  isWinner: boolean
}

type GuessNumberAction = {
  type: "guessNumber"
  payload?: null
}
type ToggleModalAction = {
  type: "toggleModal"
  payload: boolean
}
type SetNumberAction = {
  type: "setNumber"
  payload: number
}

type SetLowHigh = {
  type: "setLowHigh"
  payload: { low?: number; high?: number }
}

type CheckWinnerAction = {
  type: "checkWinner"
  payload?: null
}

type ActionTypes =
  | GuessNumberAction
  | ToggleModalAction
  | SetNumberAction
  | SetLowHigh
  | CheckWinnerAction

const initialState: StateType = {
  targetNumber: 0,
  isModalOpen: false,
  highNumber: 99,
  lowNumber: 0,
  guessedNumbers: [],
  isWinner: false
}

export default function App() {
  const [{ targetNumber, isModalOpen, guessedNumbers }, dispatch] = useReducer(
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
