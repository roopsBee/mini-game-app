import { StatusBar } from "expo-status-bar"
import React, { useState } from "react"
import { Button, Modal, StyleSheet, Text, TextInput, View } from "react-native"

export default function App() {
  const [number, setNumber] = useState(0)
  const [ismodalOpen, setIsmodalOpen] = useState(false)
  const [highNumber, setHighNumber] = useState(99)
  const [lowNumber, setLowNumber] = useState(0)

  const handleSubmitNumber = () => {
    console.log(number)
    setIsmodalOpen(true)
  }

  const handleNumberIsHigher = () => {}

  const handleNumberIsLower = () => {}

  const guessNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
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
          value={number.toString()}
          onChangeText={(text) => {
            setNumber(Number(text))
          }}
        />
        <Button title="Go" onPress={handleSubmitNumber} />
        <Modal visible={ismodalOpen} animationType="slide">
          <Text>Modal</Text>
          <View>
            <Text>My number: {number}</Text>
            <Text>Guessed number: </Text>
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
  }
})
