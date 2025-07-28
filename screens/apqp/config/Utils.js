import DeviceInfo from "react-native-device-info";

export const DeviceUniqueId = async () => {
  const id = await DeviceInfo.getUniqueId();
  return id;
};
