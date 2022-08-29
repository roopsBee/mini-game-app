import React from "react"
import { useGameMachineStore } from "./machines/gameMachine"
import {
  Button,
  Modal,
  SafeAreaView,
  Text,
  Image,
  View,
  StyleSheet
} from "react-native"

export function EndGame() {
  const {
    state: { context },
    send
  } = useGameMachineStore()
  return (
    <Modal visible={context.isWinner} animationType="slide">
      <SafeAreaView>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("../../assets/images/winner.jpg")}
          />
        </View>
        <Text>winner</Text>
        <Button
          title="reset"
          onPress={() => {
            send("restartGame")
          }}
        />
      </SafeAreaView>
    </Modal>
  )
}
const styles = StyleSheet.create({
  imageContainer: {
    height: 300,
    borderRadius: 150,
    overflow: "hidden",
    borderWidth: 5,
    borderColor: "#f09"
  },
  image: { width: "100%", height: "100%" }
})
