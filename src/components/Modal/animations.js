import { Dimensions } from "react-native";

const { height: screenHeight } = Dimensions.get("window");
const makeAnimation = (translationType, fromValue, toValue) => ({
  from: {
    [translationType]: fromValue
  },
  to: {
    [translationType]: toValue
  }
});

export const getOutAnimation = (height) => makeAnimation("translateY", 0, height);
export const getInAnimation = (height) => makeAnimation("translateY", height, 0);
