import React from "react"
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
  useWindowDimensions
} from "react-native"
import { EndGame } from "./EndGame"
import { useGameMachineStore } from "./machines/gameMachine"
import Ionicons from "@expo/vector-icons/Ionicons"

export const InGame = () => {
  const {
    state: { context },
    send
  } = useGameMachineStore()
  const { height } = useWindowDimensions()
  const padding = height < 400 ? 10 : 50
  return (
    <Modal visible={context.isGameModalOpen} animationType="slide">
      <View style={[styles.inGameContainer, { paddingTop: padding }]}>
        <View style={styles.inGameChildrenContainer}>
          <Text style={styles.myNumberText}>
            My number: {context.targetNumber}
          </Text>
          <Text style={styles.guessedNumberText}>
            Guessed number: {context.guessedNumbers[0]}{" "}
          </Text>
          <View style={styles.buttonsContainer}>
            <View style={styles.buttonsInnerContainer}>
              <Pressable
                style={styles.hiLowButtons}
                android_ripple={{ color: "#f05" }}
                onPress={() => {
                  send({
                    type: "selectHighOrLow",
                    setLow: context.guessedNumbers[0]
                  })
                }}
              >
                <Text style={styles.hiLowButtonsText}>Higher</Text>
                <Ionicons name="md-add-outline" size={20} color="white" />
              </Pressable>
            </View>
            <View style={styles.buttonsInnerContainer}>
              <Pressable
                style={styles.hiLowButtons}
                android_ripple={{ color: "#f05" }}
                onPress={() => {
                  send({
                    type: "selectHighOrLow",
                    setHigh: context.guessedNumbers[0]
                  })
                }}
              >
                <Text style={styles.hiLowButtonsText}>lower</Text>
                <Ionicons name="md-remove-outline" size={20} color="white" />
              </Pressable>
            </View>
          </View>
          <View style={styles.flatListContainer}>
            <FlatList
              data={context.guessedNumbers}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <View>
                  <Text style={styles.guessText}>{item}</Text>
                </View>
              )}
            />
          </View>
        </View>
      </View>
      <EndGame />
    </Modal>
  )
}

const styles = StyleSheet.create({
  hiLowButtons: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row"
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10
  },
  hiLowButtonsText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  buttonsInnerContainer: {
    flex: 1,
    marginHorizontal: 5
  },
  inGameContainer: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#05f",
    padding: 20
  },
  inGameChildrenContainer: {
    borderColor: "#09f",
    borderWidth: 5,
    borderRadius: 8,
    padding: 20,
    width: "100%",
    flex: 1
  },
  guessedNumberText: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginVertical: 10
  },
  myNumberText: {
    fontSize: 20,
    fontWeight: "600",
    color: "white"
  },
  guessText: {
    fontSize: 20,
    borderColor: "#09f",
    borderWidth: 5,
    borderRadius: 8,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginVertical: 5
  },
  flatListContainer: {
    flex: 1
  }
})
