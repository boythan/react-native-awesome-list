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
import { SafeAreaView, StyleSheet, Text } from "react-native";
import AwesomeListComponent from "..";

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AwesomeListComponent
        source={() => Promise.resolve([1])}
        renderItem={(item: any) => <Text>item</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
});

export default App;
