/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./example/App";
import { name as appName } from "./app.json";
import AwesomeListComponent from "./src/AwesomeListComponent";

export default AwesomeListComponent;

AppRegistry.registerComponent(appName, () => App);
