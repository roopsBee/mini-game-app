import React from "react"

import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
  Alert,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { StatusBar } from "expo-status-bar"
import { InGame } from "./src/components/InGame"
import { useGameMachineStore } from "./src/components/machines/gameMachine"
import * as SplashScreen from "expo-splash-screen"

SplashScreen.preventAutoHideAsync()

export default function App() {
  const {
    send,
    state: { context, value }
  } = useGameMachineStore()
  const { height } = useWindowDimensions()
  const padding = height < 400 ? 0 : 30
  if (value === "appLoading") {
    return null
  }

  return (
    <LinearGradient colors={["#f03", "#f0f"]} style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={require("./assets/images/home-background.jpg")}
        resizeMode={"cover"}
        style={styles.container}
        imageStyle={styles.imageStyle}
      >
        <KeyboardAvoidingView style={styles.container} behavior="height">
          <View style={styles.homeContainerWrapper}>
            <View style={styles.homeContainer}>
              <Text style={styles.enterNumberText}>
                Enter a number between 0-99
              </Text>
              <TextInput
                style={styles.inputContainer}
                keyboardType="number-pad"
                placeholder="Enter number"
                maxLength={2}
                value={context.targetNumber.toString()}
                onChangeText={(text) => {
                  if (!isNaN(+text)) {
                    send({ type: "typeNumber", value: Number(text) })
                  } else {
                    Alert.alert("alert", "not a number", [
                      { text: "I understand", style: "destructive" }
                    ])
                  }
                }}
              />
              <Button
                title="Go"
                onPress={() => {
                  send("submitNumber")
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
        <InGame />
      </ImageBackground>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
  },
  homeContainer: {
    borderColor: "#fb0",
    borderWidth: 7,
    borderRadius: 10,
    padding: 20,
    backgroundColor: Platform.select({ android: "#f50", ios: "#440" }),
    elevation: 10,
    shadowColor: "#00f",
    shadowRadius: 50,
    shadowOffset: { height: 4, width: 4 },
    shadowOpacity: 0.5,
    flex: 1,
    height: 400,
    maxHeight: "80%"
  },
  enterNumberText: {
    fontSize: 20,
    borderRadius: 5,
    paddingVertical: 5,
    color: "white",
    textTransform: "capitalize",
    fontFamily: "frederick"
  },
  inputContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "white",
    marginVertical: 10,
    borderRadius: 5,
    fontSize: 18,
    fontFamily: "frederick"
  },
  imageContainer: { flex: 1 },
  homeContainerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  imageStyle: {
    opacity: 0.6
  }
})
