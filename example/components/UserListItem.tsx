import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface Props {
  user: any;
}

const UserListItem = ({ user }: Props) => {
  return (
    <View style={styles.containerUserItem}>
      <View style={styles.containerUserItemContent}>
        <Image
          source={{ uri: user?.avatar_url }}
          style={styles.imageUserAvatar}
        />
        <View style={styles.containerUserName}>
          <Text style={styles.textUserName}>{user?.login}</Text>
        </View>
      </View>
    </View>
  );
};

export default UserListItem;

const styles = StyleSheet.create({
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
