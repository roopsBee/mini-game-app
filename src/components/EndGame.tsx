import React from "react"
import { useGameMachineStore } from "./machines/gameMachine"
import { Button, Modal, SafeAreaView, Text } from "react-native"

export function EndGame() {
  const {
    state: { context },
    send
  } = useGameMachineStore()
  return (
    <Modal visible={context.isWinner} animationType="slide">
      <SafeAreaView>
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
