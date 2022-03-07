/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import { find, map } from "lodash";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";
import AppHeader from "./components/AppHeader";
import FlatListRawData from "./components/FlatListRawData";
import FlatListSyncData from "./components/FlatListSyncData";
import { TYPE_LIST } from "./service/constant";

const App = () => {
  const [type, setType] = useState<any>();
  const onClickBack = () => setType(null);

  const renderMainContent = () => {
    switch (type) {
      case "flatListRawData":
        return <FlatListRawData />;
      case "flatListAsyncData":
        return <FlatListSyncData />;
      default:
        return renderTypeList();
    }
  };

  const renderTypeList = () =>
    map(TYPE_LIST, (typeList) => (
      <TouchableOpacity
        style={styles.containerTypeListItem}
        onPress={() => setType(typeList?.id)}
      >
        <Text>{typeList.label}</Text>
      </TouchableOpacity>
    ));

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title={find(TYPE_LIST, (item) => item.id === type)?.label ?? "List"}
        onClickBack={onClickBack}
        hiddenBack={!type}
      />
      {renderMainContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  containerTypeListItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#dadada",
    width: "100%",
  },
});

export default App;
