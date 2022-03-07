import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";

interface Props {
  title: string;
  hiddenBack: boolean;
  onClickBack: () => void;
}

const AppHeader = ({ title, hiddenBack, onClickBack }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerContent}>
        <Text style={styles.textTitle}>{title}</Text>
      </View>
      {!hiddenBack && (
        <Text onPress={onClickBack} style={styles.textBack}>
          Back
        </Text>
      )}
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    borderBottomColor: "#adadad",
    borderBottomWidth: 0.5,
  },
  containerContent: {
    alignItems: "center",
    width: "100%",
  },
  textBack: {
    position: "absolute",
    left: 16,
  },
  textTitle: { fontWeight: "bold" },
});
