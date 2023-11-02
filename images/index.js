import * as React from "react";
import Dial from "./Dial.svg";

const icons = {
  Dial,
};

export const Icon = (props) => {
  const { name, width = 16, height = 16 } = props;
  if (!(name in icons)) return null;
  const IconComponent = icons[name];
  return <IconComponent {...props} width={width} height={height} />;
};
