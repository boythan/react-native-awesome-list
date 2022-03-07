/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import AwesomeListComponent from "..";

const axios = require("axios").default;
const getUserGitList = () => {
  const instance = axios.create({
    baseURL: "https://api.github.com/",
    timeout: 1000,
  });
  return instance.get("users");
};

const App = () => {
  const source = () => {
    return getUserGitList();
  };

  const transformer = (res: any) => {
    return res?.data ?? [];
  };

  const renderUserItem = ({ item, index }: any) => (
    <View style={styles.containerUserItem}>
      <View style={styles.containerUserItemContent}>
        <Image
          source={{ uri: item?.avatar_url }}
          style={styles.imageUserAvatar}
        />
        <View style={styles.containerUserName}>
          <Text style={styles.textUserName}>{item?.login}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AwesomeListComponent
        source={source}
        renderItem={renderUserItem}
        transformer={transformer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  containerUserItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  containerUserItemContent: {
    flexDirection: "row",
  },
  containerUserName: {
    justifyContent: "center",
    alignItems: "center",
  },

  imageUserAvatar: {
    height: 48,
    width: 48,
    resizeMode: "contain",
    borderRadius: 24,
  },

  textUserName: {
    marginLeft: 16,
  },
});

export default App;
