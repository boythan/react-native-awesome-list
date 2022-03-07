import React from "react";
import AwesomeListComponent from "../..";
import API from "../service/api";
import UserListItem from "./UserListItem";

interface Props {}

const FlatListSyncData = (props: Props) => {
  const transformer = (res: any) => {
    console.log("res?.data ?? [];", res?.data ?? []);
    return res?.data ?? [];
  };

  const renderUserItem = ({ item, index }: any) => <UserListItem user={item} />;
  return (
    <AwesomeListComponent
      source={API.getUserList}
      renderItem={renderUserItem}
      transformer={transformer}
    />
  );
};

export default FlatListSyncData;
