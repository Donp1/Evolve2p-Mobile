import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Fontisto } from "@expo/vector-icons";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const CheckKyc = ({ visible, setVisible }: Props) => {
  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }}
      >
        <View
          style={{
            height: "50%",
            backgroundColor: "#222222",
            paddingHorizontal: 20,
            paddingTop: 10,
            width: "100%",
          }}
        ></View>
      </View>
    </Modal>
  );
};

export default CheckKyc;

const styles = StyleSheet.create({});
