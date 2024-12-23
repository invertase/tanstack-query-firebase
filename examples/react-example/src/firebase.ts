import { connectorConfig } from "@dataconnect/default-connector";
import { getApps, initializeApp } from "firebase/app";
import { connectDataConnectEmulator, getDataConnect } from "firebase/data-connect";

if (getApps().length === 0) {
  initializeApp({
    projectId: "example",
  });
  const dataConnect = getDataConnect(connectorConfig);
  connectDataConnectEmulator(dataConnect!, "localhost", 9399);
}