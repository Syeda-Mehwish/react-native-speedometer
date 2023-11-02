import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Dial = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <Path
      fill="#074858"
      fillRule="evenodd"
      d="M159.765 28.747c-1.269-3.53-6.261-3.53-7.529 0L140.952 60.16A97.737 97.737 0 0 1 155.999 59a97.74 97.74 0 0 1 15.049 1.16l-11.283-31.413Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default Dial;
