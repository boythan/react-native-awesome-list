/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { View } from "react-native";

interface ILineProps {
  height?: any;
  color?: any;
  style?: any;
}

const Line = ({ height, color, style }: ILineProps) => (
  <View
    style={{
      width: "100%",
      height: height || 1,
      backgroundColor: color || "#d3dfe4",
      ...style,
    }}
  />
);

export default Line;
