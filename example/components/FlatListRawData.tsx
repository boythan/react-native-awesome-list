import React from "react";
import AwesomeListComponent from "../..";
import { USER_SAMPLE } from "../service/constant";
import UserListItem from "./UserListItem";

const FlatListRawData = () => {
  const renderUserItem = ({ item, index }: any) => <UserListItem user={item} />;
  return (
    <AwesomeListComponent data={USER_SAMPLE} renderItem={renderUserItem} />
  );
};

export default FlatListRawData;
