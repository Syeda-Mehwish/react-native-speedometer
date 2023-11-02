/* eslint import/no-unresolved: [2, { ignore: ['react-native', 'react'] }] */
/* eslint radix: ["error", "as-needed"] */
import React, { Component } from "react";
import {
  View,
  Image,
  Animated,
  Easing,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import PropTypes from "prop-types";

function calculateDegreeFromLabels(degree, labels) {
  const perLevelDegree = degree / labels.length;
  return perLevelDegree;
}
function calculateLabelFromValue(value, labels, minValue, maxValue) {
  const currentValue = (value - minValue) / (maxValue - minValue);
  const currentIndex = Math.round((labels.length - 1) * currentValue);
  const label = labels[currentIndex];
  return label;
}
function limitValue(value, minValue, maxValue, allowedDecimals) {
  let currentValue = 0;
  if (!isNaN(value)) {
    if (!isNaN(allowedDecimals) && allowedDecimals > 0) {
      currentValue = parseFloat(value).toFixed(
        allowedDecimals < 4 ? parseInt(allowedDecimals) : 4
      );
    } else {
      currentValue = parseInt(value);
    }
  }
  return Math.min(Math.max(currentValue, minValue), maxValue);
}

function validateSize(current, original) {
  let currentSize = original;
  if (!isNaN(current)) {
    currentSize = parseInt(current);
  }
  return currentSize;
}

// Style
const width = Dimensions.get("window").width;
const style = StyleSheet.create({
  wrapper: {
    marginVertical: 5,
    alignSelf: "center",
  },
  // Circular Container
  circleWrapper: {
    overflow: "hidden",
  },
  outerCircle: {
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "hidden",
    borderColor: "#ffffff",
    backgroundColor: "#e6e6e6",
  },
  halfCircle: {
    position: "absolute",
    top: 0,
    left: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  imageWrapper: {
    position: "absolute",
    left: 0,
    zIndex: 10,
  },
  image: {
    resizeMode: "stretch",
    height: width - 20,
    width: width - 20,
  },
  innerCircle: {
    overflow: "hidden",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#ffffff",
    width: width * 0.6,
    height: (width / 2) * 0.6,
    borderTopLeftRadius: width / 2 - 10,
    borderTopRightRadius: width / 2 - 10,
  },
  labelWrapper: {
    marginVertical: 5,
    alignItems: "center",
  },
  label: {
    fontSize: 25,
    fontWeight: "bold",
  },
  labelNote: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

// eslint-disable-next-line react/prefer-stateless-function
class Speedometer extends Component {
  constructor(props) {
    super(props);
    this.speedometerValue = new Animated.Value(props.defaultValue);
  }

  render() {
    const {
      value,
      size,
      minValue,
      maxValue,
      easeDuration,
      allowedDecimals,
      labels,
      needleImage,
      wrapperStyle,
      outerCircleStyle,
      halfCircleStyle,
      imageWrapperStyle,
      imageStyle,
      innerCircleStyle,
      labelWrapperStyle,
      labelStyle,
      labelNoteStyle,
      useNativeDriver,
    } = this.props;
    const degree = 180;
    const perLevelDegree = calculateDegreeFromLabels(degree, labels);
    const label = calculateLabelFromValue(
      limitValue(value, minValue, maxValue, allowedDecimals),
      labels,
      minValue,
      maxValue
    );
    Animated.timing(this.speedometerValue, {
      toValue: limitValue(value, minValue, maxValue, allowedDecimals),
      duration: easeDuration,
      easing: Easing.linear,
      useNativeDriver,
    }).start();

    const rotate = this.speedometerValue.interpolate({
      inputRange: [minValue, maxValue],
      outputRange: ["-90deg", "90deg"],
    });

    const currentSize = validateSize(size, width - 20);
    return (
      <View
        style={[
          style.wrapper,
          {
            width: currentSize,
            height: currentSize / 2,
          },
          wrapperStyle,
        ]}
      >
        <View
          style={[
            style.outerCircle,
            {
              width: currentSize,
              height: currentSize / 2,
              borderTopLeftRadius: currentSize / 2,
              borderTopRightRadius: currentSize / 2,
            },
            outerCircleStyle,
          ]}
        >
          {labels.map((level, index) => {
            const circleDegree = 90 + index * perLevelDegree;
            return (
              <View
                key={level.name}
                style={[
                  style.halfCircle,
                  {
                    backgroundColor: level.activeBarColor,
                    width: currentSize / 2,
                    height: currentSize,
                    borderRadius: currentSize / 2,
                    transform: [
                      { translateX: currentSize / 4 },
                      { rotate: `${circleDegree}deg` },
                      { translateX: (currentSize / 4) * -1 },
                    ],
                  },
                  halfCircleStyle,
                ]}
              />
            );
          })}
          <Animated.View
            style={[
              style.imageWrapper,
              {
                top: -(currentSize / 15),
                transform: [{ rotate }],
              },
              imageWrapperStyle,
            ]}
          >
            {needleImage}
            {/* <Image
              style={[
                style.image,
                {
                  width: currentSize,
                  height: currentSize,
                },
                imageStyle,
              ]}
              source={needleImage}
            /> */}
          </Animated.View>
          <View
            style={[
              style.innerCircle,
              {
                width: currentSize * 0.6,
                height: (currentSize / 2) * 0.6,
                borderTopLeftRadius: currentSize / 2,
                borderTopRightRadius: currentSize / 2,
              },
              innerCircleStyle,
            ]}
          />
        </View>
        <View style={[style.labelWrapper, labelWrapperStyle]}>
          <Text style={[style.label, labelStyle]}>
            {limitValue(value, minValue, maxValue, allowedDecimals)}
          </Text>
          <Text
            style={[
              style.labelNote,
              { color: label.labelColor },
              labelNoteStyle,
            ]}
          >
            {label.name}
          </Text>
        </View>
      </View>
    );
  }
}

Speedometer.defaultProps = {
  defaultValue: 50,
  minValue: 0,
  maxValue: 100,
  easeDuration: 500,
  allowedDecimals: 0,
  labels: [
    {
      name: "Pathetically weak",
      labelColor: "#ff2900",
      activeBarColor: "#ff2900",
    },
    {
      name: "Very weak",
      labelColor: "#ff5400",
      activeBarColor: "#ff5400",
    },
    {
      name: "So-so",
      labelColor: "#f4ab44",
      activeBarColor: "#f4ab44",
    },
    {
      name: "Fair",
      labelColor: "#f2cf1f",
      activeBarColor: "#f2cf1f",
    },
    {
      name: "Strong",
      labelColor: "#14eb6e",
      activeBarColor: "#14eb6e",
    },
    {
      name: "Unbelievably strong",
      labelColor: "#00ff6b",
      activeBarColor: "#00ff6b",
    },
  ],
  needleImage: {},
  wrapperStyle: {},
  outerCircleStyle: {},
  halfCircleStyle: {},
  imageWrapperStyle: {},
  imageStyle: {},
  innerCircleStyle: {},
  labelWrapperStyle: {},
  labelStyle: {},
  labelNoteStyle: {},
  useNativeDriver: true,
};

Speedometer.propTypes = {
  value: PropTypes.number.isRequired,
  defaultValue: PropTypes.number,
  size: PropTypes.number,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  easeDuration: PropTypes.number,
  allowedDecimals: PropTypes.number,
  labels: PropTypes.array,
  needleImage: PropTypes.any,
  wrapperStyle: PropTypes.object,
  outerCircleStyle: PropTypes.object,
  halfCircleStyle: PropTypes.object,
  imageWrapperStyle: PropTypes.object,
  imageStyle: PropTypes.object,
  innerCircleStyle: PropTypes.object,
  labelWrapperStyle: PropTypes.object,
  labelStyle: PropTypes.object,
  labelNoteStyle: PropTypes.object,
  useNativeDriver: PropTypes.bool,
};

export default Speedometer;
