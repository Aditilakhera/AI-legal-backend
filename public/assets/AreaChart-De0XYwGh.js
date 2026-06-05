import { ap as isNumber, aq as Global, ar as getStringSize, as as mathSign, r as reactExports, at as resolveDefaultProps, au as DefaultZIndexes, av as ZIndexLayer, aw as Layer, ax as clsx, ay as svgPropertiesNoEvents, az as CartesianLabelContextProvider, aA as CartesianLabelFromLabelProp, aB as get, aC as svgPropertiesNoEventsFromUnknown, aD as isValidTextAnchor, aE as adaptEventsOfChild, aF as getClassNameFromUnknown, aG as Text, aH as useAppDispatch, aI as noop, aJ as setRenderedTicks, aK as removeRenderedTicks, aL as defaultAxisId, aM as createSelector, aN as selectChartLayout, aO as selectChartDataWithIndexesIfNotInPanoramaPosition3, aP as selectChartBaseValue, aQ as selectAxisWithScale, aR as selectTicksOfGraphicalItem, aS as getStackSeriesIdentifier, aT as isCategoricalAxis, aU as getBandSizeOfAxis, aV as selectUnfilteredCartesianItems, aW as selectStackGroups, aX as propsAreEqual, aY as useIsPanorama, aZ as RegisterGraphicalItemId, a_ as SetLegendPayload, a$ as SetCartesianGraphicalItem, b0 as getNormalizedStackId, b1 as getTooltipNameProp, b2 as SetTooltipEntrySettings, b3 as useChartLayout, b4 as useChartName, b5 as useNeedsClip, b6 as useAppSelector, b7 as usePlotArea, b8 as getRadiusAndStrokeWidthFromDot, b9 as isClipDot, ba as GraphicalItemClipPath, bb as ActivePoints, bc as getValueByDataKey, bd as getCateCoordinateOfLine, be as useAnimationId, bf as useCartesianChartLayout, bg as JavascriptAnimate, bh as interpolate, bi as isNullish, bj as isNan, bk as LabelListFromLabelProp, bl as CartesianLabelListContextProvider, bm as svgPropertiesAndEvents, bn as Curve, bo as Dots, bp as isWellBehavedNumber, bq as addXAxis, br as replaceXAxis, bs as removeXAxis, bt as implicitXAxis, bu as selectAxisViewBox, bv as selectTicksOfAxis, bw as selectXAxisSize, bx as selectXAxisPosition, by as selectXAxisSettingsNoDefaults, bz as getAxisTypeBasedOnLayout, bA as addYAxis, bB as replaceYAxis, bC as removeYAxis, bD as implicitYAxis, bE as selectYAxisSize, bF as selectYAxisPosition, bG as selectYAxisSettingsNoDefaults, bH as isLabelContentAFunction, bI as updateYAxisWidth, bJ as CartesianChart, bK as arrayTooltipSearcher } from "./index--V45kKqF.js";
function normalizeAngle(angle) {
  return (angle % 180 + 180) % 180;
}
var getAngledRectangleWidth = function getAngledRectangleWidth2(_ref4) {
  var {
    width,
    height
  } = _ref4;
  var angle = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  var normalizedAngle = normalizeAngle(angle);
  var angleRadians = normalizedAngle * Math.PI / 180;
  var angleThreshold = Math.atan(height / width);
  var angledWidth = angleRadians > angleThreshold && angleRadians < Math.PI - angleThreshold ? height / Math.sin(angleRadians) : width / Math.cos(angleRadians);
  return Math.abs(angledWidth);
};
function getEveryNth(array, n) {
  if (n < 1) {
    return [];
  }
  if (n === 1) {
    return array;
  }
  var result = [];
  for (var i = 0; i < array.length; i += n) {
    var item = array[i];
    if (item !== void 0) {
      result.push(item);
    }
  }
  return result;
}
function getAngledTickWidth(contentSize, unitSize, angle) {
  var size = {
    width: contentSize.width + unitSize.width,
    height: contentSize.height + unitSize.height
  };
  return getAngledRectangleWidth(size, angle);
}
function getTickBoundaries(viewBox, sign, sizeKey) {
  var isWidth = sizeKey === "width";
  var {
    x,
    y,
    width,
    height
  } = viewBox;
  if (sign === 1) {
    return {
      start: isWidth ? x : y,
      end: isWidth ? x + width : y + height
    };
  }
  return {
    start: isWidth ? x + width : y + height,
    end: isWidth ? x : y
  };
}
function isVisible(sign, tickPosition, getSize, start, end) {
  if (sign * tickPosition < sign * start || sign * tickPosition > sign * end) {
    return false;
  }
  var size = getSize();
  return sign * (tickPosition - sign * size / 2 - start) >= 0 && sign * (tickPosition + sign * size / 2 - end) <= 0;
}
function getNumberIntervalTicks(ticks, interval) {
  return getEveryNth(ticks, interval + 1);
}
function getEquidistantTicks(sign, boundaries, getTickSize, ticks, minTickGap) {
  var result = (ticks || []).slice();
  var {
    start: initialStart,
    end
  } = boundaries;
  var index = 0;
  var stepsize = 1;
  var start = initialStart;
  var _loop = function _loop2() {
    var entry = ticks === null || ticks === void 0 ? void 0 : ticks[index];
    if (entry === void 0) {
      return {
        v: getEveryNth(ticks, stepsize)
      };
    }
    var i = index;
    var size;
    var getSize = () => {
      if (size === void 0) {
        size = getTickSize(entry, i);
      }
      return size;
    };
    var tickCoord = entry.coordinate;
    var isShow = index === 0 || isVisible(sign, tickCoord, getSize, start, end);
    if (!isShow) {
      index = 0;
      start = initialStart;
      stepsize += 1;
    }
    if (isShow) {
      start = tickCoord + sign * (getSize() / 2 + minTickGap);
      index += stepsize;
    }
  }, _ret;
  while (stepsize <= result.length) {
    _ret = _loop();
    if (_ret) return _ret.v;
  }
  return [];
}
function getEquidistantPreserveEndTicks(sign, boundaries, getTickSize, ticks, minTickGap) {
  var result = (ticks || []).slice();
  var len = result.length;
  if (len === 0) {
    return [];
  }
  var {
    start: initialStart,
    end
  } = boundaries;
  for (var stepsize = 1; stepsize <= len; stepsize++) {
    var offset = (len - 1) % stepsize;
    var start = initialStart;
    var ok = true;
    var _loop2 = function _loop22() {
      var entry = ticks[index];
      if (entry == null) {
        return 0;
      }
      var i = index;
      var size;
      var getSize = () => {
        if (size === void 0) {
          size = getTickSize(entry, i);
        }
        return size;
      };
      var tickCoord = entry.coordinate;
      var isShow = index === offset || isVisible(sign, tickCoord, getSize, start, end);
      if (!isShow) {
        ok = false;
        return 1;
      }
      if (isShow) {
        start = tickCoord + sign * (getSize() / 2 + minTickGap);
      }
    }, _ret2;
    for (var index = offset; index < len; index += stepsize) {
      _ret2 = _loop2();
      if (_ret2 === 0) continue;
      if (_ret2 === 1) break;
    }
    if (ok) {
      var finalTicks = [];
      for (var _index = offset; _index < len; _index += stepsize) {
        var tick = ticks[_index];
        if (tick != null) {
          finalTicks.push(tick);
        }
      }
      return finalTicks;
    }
  }
  return [];
}
function ownKeys$4(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$4(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$4(Object(t), true).forEach(function(r2) {
      _defineProperty$4(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$4(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$4(e, r, t) {
  return (r = _toPropertyKey$4(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey$4(t) {
  var i = _toPrimitive$4(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$4(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function getTicksEnd(sign, boundaries, getTickSize, ticks, minTickGap) {
  var result = (ticks || []).slice();
  var len = result.length;
  var {
    start
  } = boundaries;
  var {
    end
  } = boundaries;
  var _loop = function _loop2(i2) {
    var initialEntry = result[i2];
    if (initialEntry == null) {
      return 1;
    }
    var entry = initialEntry;
    var size;
    var getSize = () => {
      if (size === void 0) {
        size = getTickSize(initialEntry, i2);
      }
      return size;
    };
    if (i2 === len - 1) {
      var gap = sign * (entry.coordinate + sign * getSize() / 2 - end);
      result[i2] = entry = _objectSpread$4(_objectSpread$4({}, entry), {}, {
        tickCoord: gap > 0 ? entry.coordinate - gap * sign : entry.coordinate
      });
    } else {
      result[i2] = entry = _objectSpread$4(_objectSpread$4({}, entry), {}, {
        tickCoord: entry.coordinate
      });
    }
    if (entry.tickCoord != null) {
      var isShow = isVisible(sign, entry.tickCoord, getSize, start, end);
      if (isShow) {
        end = entry.tickCoord - sign * (getSize() / 2 + minTickGap);
        result[i2] = _objectSpread$4(_objectSpread$4({}, entry), {}, {
          isShow: true
        });
      }
    }
  };
  for (var i = len - 1; i >= 0; i--) {
    if (_loop(i)) continue;
  }
  return result;
}
function getTicksStart(sign, boundaries, getTickSize, ticks, minTickGap, preserveEnd) {
  var result = (ticks || []).slice();
  var len = result.length;
  var {
    start,
    end
  } = boundaries;
  if (preserveEnd) {
    var tail = ticks[len - 1];
    if (tail != null) {
      var tailSize = getTickSize(tail, len - 1);
      var tailGap = sign * (tail.coordinate + sign * tailSize / 2 - end);
      result[len - 1] = tail = _objectSpread$4(_objectSpread$4({}, tail), {}, {
        tickCoord: tailGap > 0 ? tail.coordinate - tailGap * sign : tail.coordinate
      });
      if (tail.tickCoord != null) {
        var isTailShow = isVisible(sign, tail.tickCoord, () => tailSize, start, end);
        if (isTailShow) {
          end = tail.tickCoord - sign * (tailSize / 2 + minTickGap);
          result[len - 1] = _objectSpread$4(_objectSpread$4({}, tail), {}, {
            isShow: true
          });
        }
      }
    }
  }
  var count = preserveEnd ? len - 1 : len;
  var _loop2 = function _loop22(i2) {
    var initialEntry = result[i2];
    if (initialEntry == null) {
      return 1;
    }
    var entry = initialEntry;
    var size;
    var getSize = () => {
      if (size === void 0) {
        size = getTickSize(initialEntry, i2);
      }
      return size;
    };
    if (i2 === 0) {
      var gap = sign * (entry.coordinate - sign * getSize() / 2 - start);
      result[i2] = entry = _objectSpread$4(_objectSpread$4({}, entry), {}, {
        tickCoord: gap < 0 ? entry.coordinate - gap * sign : entry.coordinate
      });
    } else {
      result[i2] = entry = _objectSpread$4(_objectSpread$4({}, entry), {}, {
        tickCoord: entry.coordinate
      });
    }
    if (entry.tickCoord != null) {
      var isShow = isVisible(sign, entry.tickCoord, getSize, start, end);
      if (isShow) {
        start = entry.tickCoord + sign * (getSize() / 2 + minTickGap);
        result[i2] = _objectSpread$4(_objectSpread$4({}, entry), {}, {
          isShow: true
        });
      }
    }
  };
  for (var i = 0; i < count; i++) {
    if (_loop2(i)) continue;
  }
  return result;
}
function getTicks(props, fontSize, letterSpacing) {
  var {
    tick,
    ticks,
    viewBox,
    minTickGap,
    orientation,
    interval,
    tickFormatter,
    unit,
    angle
  } = props;
  if (!ticks || !ticks.length || !tick) {
    return [];
  }
  if (isNumber(interval) || Global.isSsr) {
    var _getNumberIntervalTic;
    return (_getNumberIntervalTic = getNumberIntervalTicks(ticks, isNumber(interval) ? interval : 0)) !== null && _getNumberIntervalTic !== void 0 ? _getNumberIntervalTic : [];
  }
  var candidates = [];
  var sizeKey = orientation === "top" || orientation === "bottom" ? "width" : "height";
  var unitSize = unit && sizeKey === "width" ? getStringSize(unit, {
    fontSize,
    letterSpacing
  }) : {
    width: 0,
    height: 0
  };
  var getTickSize = (content, index) => {
    var value = typeof tickFormatter === "function" ? tickFormatter(content.value, index) : content.value;
    return sizeKey === "width" ? getAngledTickWidth(getStringSize(value, {
      fontSize,
      letterSpacing
    }), unitSize, angle) : getStringSize(value, {
      fontSize,
      letterSpacing
    })[sizeKey];
  };
  var tick0 = ticks[0];
  var tick1 = ticks[1];
  var sign = ticks.length >= 2 && tick0 != null && tick1 != null ? mathSign(tick1.coordinate - tick0.coordinate) : 1;
  var boundaries = getTickBoundaries(viewBox, sign, sizeKey);
  if (interval === "equidistantPreserveStart") {
    return getEquidistantTicks(sign, boundaries, getTickSize, ticks, minTickGap);
  }
  if (interval === "equidistantPreserveEnd") {
    return getEquidistantPreserveEndTicks(sign, boundaries, getTickSize, ticks, minTickGap);
  }
  if (interval === "preserveStart" || interval === "preserveStartEnd") {
    candidates = getTicksStart(sign, boundaries, getTickSize, ticks, minTickGap, interval === "preserveStartEnd");
  } else {
    candidates = getTicksEnd(sign, boundaries, getTickSize, ticks, minTickGap);
  }
  return candidates.filter((entry) => entry.isShow);
}
var getCalculatedYAxisWidth = (_ref) => {
  var {
    ticks,
    label,
    labelGapWithTick = 5,
    // Default gap between label and tick
    tickSize = 0,
    tickMargin = 0
  } = _ref;
  var maxTickWidth = 0;
  if (ticks) {
    Array.from(ticks).forEach((tickNode) => {
      if (tickNode) {
        var bbox = tickNode.getBoundingClientRect();
        if (bbox.width > maxTickWidth) {
          maxTickWidth = bbox.width;
        }
      }
    });
    var labelWidth = label ? label.getBoundingClientRect().width : 0;
    var tickWidth = tickSize + tickMargin;
    var updatedYAxisWidth = maxTickWidth + tickWidth + labelWidth + (label ? labelGapWithTick : 0);
    return Math.round(updatedYAxisWidth);
  }
  return 0;
};
var _excluded$4 = ["axisLine", "width", "height", "className", "hide", "ticks", "axisType", "axisId"];
function _objectWithoutProperties$4(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose$4(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose$4(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function _extends$3() {
  return _extends$3 = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends$3.apply(null, arguments);
}
function ownKeys$3(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$3(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$3(Object(t), true).forEach(function(r2) {
      _defineProperty$3(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$3(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$3(e, r, t) {
  return (r = _toPropertyKey$3(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey$3(t) {
  var i = _toPrimitive$3(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$3(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var defaultCartesianAxisProps = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  viewBox: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  // The orientation of axis
  orientation: "bottom",
  // The ticks
  ticks: [],
  stroke: "#666",
  tickLine: true,
  axisLine: true,
  tick: true,
  mirror: false,
  minTickGap: 5,
  // The width or height of tick
  tickSize: 6,
  tickMargin: 2,
  interval: "preserveEnd",
  zIndex: DefaultZIndexes.axis
};
function AxisLine(axisLineProps) {
  var {
    x,
    y,
    width,
    height,
    orientation,
    mirror,
    axisLine,
    otherSvgProps
  } = axisLineProps;
  if (!axisLine) {
    return null;
  }
  var props = _objectSpread$3(_objectSpread$3(_objectSpread$3({}, otherSvgProps), svgPropertiesNoEvents(axisLine)), {}, {
    fill: "none"
  });
  if (orientation === "top" || orientation === "bottom") {
    var needHeight = +(orientation === "top" && !mirror || orientation === "bottom" && mirror);
    props = _objectSpread$3(_objectSpread$3({}, props), {}, {
      x1: x,
      y1: y + needHeight * height,
      x2: x + width,
      y2: y + needHeight * height
    });
  } else {
    var needWidth = +(orientation === "left" && !mirror || orientation === "right" && mirror);
    props = _objectSpread$3(_objectSpread$3({}, props), {}, {
      x1: x + needWidth * width,
      y1: y,
      x2: x + needWidth * width,
      y2: y + height
    });
  }
  return /* @__PURE__ */ reactExports.createElement("line", _extends$3({}, props, {
    className: clsx("recharts-cartesian-axis-line", get(axisLine, "className"))
  }));
}
function getTickLineCoord(data, x, y, width, height, orientation, tickSize, mirror, tickMargin) {
  var x1, x2, y1, y2, tx, ty;
  var sign = mirror ? -1 : 1;
  var finalTickSize = data.tickSize || tickSize;
  var tickCoord = isNumber(data.tickCoord) ? data.tickCoord : data.coordinate;
  switch (orientation) {
    case "top":
      x1 = x2 = data.coordinate;
      y2 = y + +!mirror * height;
      y1 = y2 - sign * finalTickSize;
      ty = y1 - sign * tickMargin;
      tx = tickCoord;
      break;
    case "left":
      y1 = y2 = data.coordinate;
      x2 = x + +!mirror * width;
      x1 = x2 - sign * finalTickSize;
      tx = x1 - sign * tickMargin;
      ty = tickCoord;
      break;
    case "right":
      y1 = y2 = data.coordinate;
      x2 = x + +mirror * width;
      x1 = x2 + sign * finalTickSize;
      tx = x1 + sign * tickMargin;
      ty = tickCoord;
      break;
    default:
      x1 = x2 = data.coordinate;
      y2 = y + +mirror * height;
      y1 = y2 + sign * finalTickSize;
      ty = y1 + sign * tickMargin;
      tx = tickCoord;
      break;
  }
  return {
    line: {
      x1,
      y1,
      x2,
      y2
    },
    tick: {
      x: tx,
      y: ty
    }
  };
}
function getTickTextAnchor(orientation, mirror) {
  switch (orientation) {
    case "left":
      return mirror ? "start" : "end";
    case "right":
      return mirror ? "end" : "start";
    default:
      return "middle";
  }
}
function getTickVerticalAnchor(orientation, mirror) {
  switch (orientation) {
    case "left":
    case "right":
      return "middle";
    case "top":
      return mirror ? "start" : "end";
    default:
      return mirror ? "end" : "start";
  }
}
function TickItem(props) {
  var {
    option,
    tickProps,
    value
  } = props;
  var tickItem;
  var combinedClassName = clsx(tickProps.className, "recharts-cartesian-axis-tick-value");
  if (/* @__PURE__ */ reactExports.isValidElement(option)) {
    tickItem = /* @__PURE__ */ reactExports.cloneElement(option, _objectSpread$3(_objectSpread$3({}, tickProps), {}, {
      className: combinedClassName
    }));
  } else if (typeof option === "function") {
    tickItem = option(_objectSpread$3(_objectSpread$3({}, tickProps), {}, {
      className: combinedClassName
    }));
  } else {
    var className = "recharts-cartesian-axis-tick-value";
    if (typeof option !== "boolean") {
      className = clsx(className, getClassNameFromUnknown(option));
    }
    tickItem = /* @__PURE__ */ reactExports.createElement(Text, _extends$3({}, tickProps, {
      className
    }), value);
  }
  return tickItem;
}
function RenderedTicksReporter(_ref) {
  var {
    ticks,
    axisType,
    axisId
  } = _ref;
  var dispatch = useAppDispatch();
  reactExports.useEffect(() => {
    if (axisId == null || axisType == null) {
      return noop;
    }
    var tickItems = ticks.map((tick) => ({
      value: tick.value,
      coordinate: tick.coordinate,
      offset: tick.offset,
      index: tick.index
    }));
    dispatch(setRenderedTicks({
      ticks: tickItems,
      axisId,
      axisType
    }));
    return () => {
      dispatch(removeRenderedTicks({
        axisId,
        axisType
      }));
    };
  }, [dispatch, ticks, axisId, axisType]);
  return null;
}
var Ticks = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  var {
    ticks = [],
    tick,
    tickLine,
    stroke,
    tickFormatter,
    unit,
    padding,
    tickTextProps,
    orientation,
    mirror,
    x,
    y,
    width,
    height,
    tickSize,
    tickMargin,
    fontSize,
    letterSpacing,
    getTicksConfig,
    events,
    axisType,
    axisId
  } = props;
  var finalTicks = getTicks(_objectSpread$3(_objectSpread$3({}, getTicksConfig), {}, {
    ticks
  }), fontSize, letterSpacing);
  var axisProps = svgPropertiesNoEvents(getTicksConfig);
  var customTickProps = svgPropertiesNoEventsFromUnknown(tick);
  var textAnchor = isValidTextAnchor(axisProps.textAnchor) ? axisProps.textAnchor : getTickTextAnchor(orientation, mirror);
  var verticalAnchor = getTickVerticalAnchor(orientation, mirror);
  var tickLinePropsObject = {};
  if (typeof tickLine === "object") {
    tickLinePropsObject = tickLine;
  }
  var tickLineProps = _objectSpread$3(_objectSpread$3({}, axisProps), {}, {
    fill: "none"
  }, tickLinePropsObject);
  var tickLineCoords = finalTicks.map((entry) => _objectSpread$3({
    entry
  }, getTickLineCoord(entry, x, y, width, height, orientation, tickSize, mirror, tickMargin)));
  var tickLines = tickLineCoords.map((_ref2) => {
    var {
      entry,
      line: lineCoord
    } = _ref2;
    return /* @__PURE__ */ reactExports.createElement(Layer, {
      className: "recharts-cartesian-axis-tick",
      key: "tick-".concat(entry.value, "-").concat(entry.coordinate, "-").concat(entry.tickCoord)
    }, tickLine && /* @__PURE__ */ reactExports.createElement("line", _extends$3({}, tickLineProps, lineCoord, {
      className: clsx("recharts-cartesian-axis-tick-line", get(tickLine, "className"))
    })));
  });
  var tickLabels = tickLineCoords.map((_ref3, i) => {
    var _ref4, _tickTextProps$angle;
    var {
      entry,
      tick: tickCoord
    } = _ref3;
    var tickProps = _objectSpread$3(_objectSpread$3(_objectSpread$3(_objectSpread$3({
      verticalAnchor
    }, axisProps), {}, {
      textAnchor,
      stroke: "none",
      fill: stroke
    }, tickCoord), {}, {
      index: i,
      payload: entry,
      visibleTicksCount: finalTicks.length,
      tickFormatter,
      padding
    }, tickTextProps), {}, {
      angle: (_ref4 = (_tickTextProps$angle = tickTextProps === null || tickTextProps === void 0 ? void 0 : tickTextProps.angle) !== null && _tickTextProps$angle !== void 0 ? _tickTextProps$angle : axisProps.angle) !== null && _ref4 !== void 0 ? _ref4 : 0
    });
    var finalTickProps = _objectSpread$3(_objectSpread$3({}, tickProps), customTickProps);
    return /* @__PURE__ */ reactExports.createElement(Layer, _extends$3({
      className: "recharts-cartesian-axis-tick-label",
      key: "tick-label-".concat(entry.value, "-").concat(entry.coordinate, "-").concat(entry.tickCoord)
    }, adaptEventsOfChild(events, entry, i)), tick && /* @__PURE__ */ reactExports.createElement(TickItem, {
      option: tick,
      tickProps: finalTickProps,
      value: "".concat(typeof tickFormatter === "function" ? tickFormatter(entry.value, i) : entry.value).concat(unit || "")
    }));
  });
  return /* @__PURE__ */ reactExports.createElement("g", {
    className: "recharts-cartesian-axis-ticks recharts-".concat(axisType, "-ticks")
  }, /* @__PURE__ */ reactExports.createElement(RenderedTicksReporter, {
    ticks: finalTicks,
    axisId,
    axisType
  }), tickLabels.length > 0 && /* @__PURE__ */ reactExports.createElement(ZIndexLayer, {
    zIndex: DefaultZIndexes.label
  }, /* @__PURE__ */ reactExports.createElement("g", {
    className: "recharts-cartesian-axis-tick-labels recharts-".concat(axisType, "-tick-labels"),
    ref
  }, tickLabels)), tickLines.length > 0 && /* @__PURE__ */ reactExports.createElement("g", {
    className: "recharts-cartesian-axis-tick-lines recharts-".concat(axisType, "-tick-lines")
  }, tickLines));
});
var CartesianAxisComponent = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  var {
    axisLine,
    width,
    height,
    className,
    hide,
    ticks,
    axisType,
    axisId
  } = props, rest = _objectWithoutProperties$4(props, _excluded$4);
  var [fontSize, setFontSize] = reactExports.useState("");
  var [letterSpacing, setLetterSpacing] = reactExports.useState("");
  var tickRefs = reactExports.useRef(null);
  reactExports.useImperativeHandle(ref, () => ({
    getCalculatedWidth: () => {
      var _props$labelRef;
      return getCalculatedYAxisWidth({
        ticks: tickRefs.current,
        label: (_props$labelRef = props.labelRef) === null || _props$labelRef === void 0 ? void 0 : _props$labelRef.current,
        labelGapWithTick: 5,
        tickSize: props.tickSize,
        tickMargin: props.tickMargin
      });
    }
  }));
  var layerRef = reactExports.useCallback((el) => {
    if (el) {
      var tickNodes = el.getElementsByClassName("recharts-cartesian-axis-tick-value");
      tickRefs.current = tickNodes;
      var tick = tickNodes[0];
      if (tick) {
        var computedStyle = window.getComputedStyle(tick);
        var calculatedFontSize = computedStyle.fontSize;
        var calculatedLetterSpacing = computedStyle.letterSpacing;
        if (calculatedFontSize !== fontSize || calculatedLetterSpacing !== letterSpacing) {
          setFontSize(calculatedFontSize);
          setLetterSpacing(calculatedLetterSpacing);
        }
      }
    }
  }, [fontSize, letterSpacing]);
  if (hide) {
    return null;
  }
  if (width != null && width <= 0 || height != null && height <= 0) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(ZIndexLayer, {
    zIndex: props.zIndex
  }, /* @__PURE__ */ reactExports.createElement(Layer, {
    className: clsx("recharts-cartesian-axis", className)
  }, /* @__PURE__ */ reactExports.createElement(AxisLine, {
    x: props.x,
    y: props.y,
    width,
    height,
    orientation: props.orientation,
    mirror: props.mirror,
    axisLine,
    otherSvgProps: svgPropertiesNoEvents(props)
  }), /* @__PURE__ */ reactExports.createElement(Ticks, {
    ref: layerRef,
    axisType,
    events: rest,
    fontSize,
    getTicksConfig: props,
    height: props.height,
    letterSpacing,
    mirror: props.mirror,
    orientation: props.orientation,
    padding: props.padding,
    stroke: props.stroke,
    tick: props.tick,
    tickFormatter: props.tickFormatter,
    tickLine: props.tickLine,
    tickMargin: props.tickMargin,
    tickSize: props.tickSize,
    tickTextProps: props.tickTextProps,
    ticks,
    unit: props.unit,
    width: props.width,
    x: props.x,
    y: props.y,
    axisId
  }), /* @__PURE__ */ reactExports.createElement(CartesianLabelContextProvider, {
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height,
    lowerWidth: props.width,
    upperWidth: props.width
  }, /* @__PURE__ */ reactExports.createElement(CartesianLabelFromLabelProp, {
    label: props.label,
    labelRef: props.labelRef
  }), props.children)));
});
var CartesianAxis = /* @__PURE__ */ reactExports.forwardRef((outsideProps, ref) => {
  var props = resolveDefaultProps(outsideProps, defaultCartesianAxisProps);
  return /* @__PURE__ */ reactExports.createElement(CartesianAxisComponent, _extends$3({}, props, {
    ref
  }));
});
CartesianAxis.displayName = "CartesianAxis";
function selectXAxisIdFromGraphicalItemId(state, id) {
  var _state$graphicalItems, _state$graphicalItems2;
  return (_state$graphicalItems = (_state$graphicalItems2 = state.graphicalItems.cartesianItems.find((item) => item.id === id)) === null || _state$graphicalItems2 === void 0 ? void 0 : _state$graphicalItems2.xAxisId) !== null && _state$graphicalItems !== void 0 ? _state$graphicalItems : defaultAxisId;
}
function selectYAxisIdFromGraphicalItemId(state, id) {
  var _state$graphicalItems3, _state$graphicalItems4;
  return (_state$graphicalItems3 = (_state$graphicalItems4 = state.graphicalItems.cartesianItems.find((item) => item.id === id)) === null || _state$graphicalItems4 === void 0 ? void 0 : _state$graphicalItems4.yAxisId) !== null && _state$graphicalItems3 !== void 0 ? _state$graphicalItems3 : defaultAxisId;
}
var selectXAxisWithScale = (state, graphicalItemId, isPanorama) => selectAxisWithScale(state, "xAxis", selectXAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectXAxisTicks = (state, graphicalItemId, isPanorama) => selectTicksOfGraphicalItem(state, "xAxis", selectXAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectYAxisWithScale = (state, graphicalItemId, isPanorama) => selectAxisWithScale(state, "yAxis", selectYAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectYAxisTicks = (state, graphicalItemId, isPanorama) => selectTicksOfGraphicalItem(state, "yAxis", selectYAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectBandSize = createSelector([selectChartLayout, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks) => {
  if (isCategoricalAxis(layout, "xAxis")) {
    return getBandSizeOfAxis(xAxis, xAxisTicks, false);
  }
  return getBandSizeOfAxis(yAxis, yAxisTicks, false);
});
var pickAreaId = (_state, id) => id;
var selectSynchronisedAreaSettings = createSelector([selectUnfilteredCartesianItems, pickAreaId], (graphicalItems, id) => graphicalItems.filter((item) => item.type === "area").find((item) => item.id === id));
var selectNumericalAxisType = (state) => {
  var layout = selectChartLayout(state);
  var isXAxisCategorical = isCategoricalAxis(layout, "xAxis");
  return isXAxisCategorical ? "yAxis" : "xAxis";
};
var selectNumericalAxisIdFromGraphicalItemId = (state, graphicalItemId) => {
  var axisType = selectNumericalAxisType(state);
  if (axisType === "yAxis") {
    return selectYAxisIdFromGraphicalItemId(state, graphicalItemId);
  }
  return selectXAxisIdFromGraphicalItemId(state, graphicalItemId);
};
var selectNumericalAxisStackGroups = (state, graphicalItemId, isPanorama) => selectStackGroups(state, selectNumericalAxisType(state), selectNumericalAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectGraphicalItemStackedData = createSelector([selectSynchronisedAreaSettings, selectNumericalAxisStackGroups], (areaSettings, stackGroups) => {
  var _stackGroups$stackId;
  if (areaSettings == null || stackGroups == null) {
    return void 0;
  }
  var {
    stackId
  } = areaSettings;
  var stackSeriesIdentifier = getStackSeriesIdentifier(areaSettings);
  if (stackId == null || stackSeriesIdentifier == null) {
    return void 0;
  }
  var groups = (_stackGroups$stackId = stackGroups[stackId]) === null || _stackGroups$stackId === void 0 ? void 0 : _stackGroups$stackId.stackedData;
  var found = groups === null || groups === void 0 ? void 0 : groups.find((v) => v.key === stackSeriesIdentifier);
  if (found == null) {
    return void 0;
  }
  return found.map((item) => [item[0], item[1]]);
});
var selectArea = createSelector([selectChartLayout, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks, selectGraphicalItemStackedData, selectChartDataWithIndexesIfNotInPanoramaPosition3, selectBandSize, selectSynchronisedAreaSettings, selectChartBaseValue], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks, stackedData, _ref, bandSize, areaSettings, chartBaseValue) => {
  var {
    chartData,
    dataStartIndex,
    dataEndIndex
  } = _ref;
  if (areaSettings == null || layout !== "horizontal" && layout !== "vertical" || xAxis == null || yAxis == null || xAxisTicks == null || yAxisTicks == null || xAxisTicks.length === 0 || yAxisTicks.length === 0 || bandSize == null) {
    return void 0;
  }
  var {
    data
  } = areaSettings;
  var displayedData;
  if (data && data.length > 0) {
    displayedData = data;
  } else {
    displayedData = chartData === null || chartData === void 0 ? void 0 : chartData.slice(dataStartIndex, dataEndIndex + 1);
  }
  if (displayedData == null) {
    return void 0;
  }
  return computeArea({
    layout,
    xAxis,
    yAxis,
    xAxisTicks,
    yAxisTicks,
    dataStartIndex,
    areaSettings,
    stackedData,
    displayedData,
    chartBaseValue,
    bandSize
  });
});
var _excluded$3 = ["id"], _excluded2$3 = ["activeDot", "animationBegin", "animationDuration", "animationEasing", "connectNulls", "dot", "fill", "fillOpacity", "hide", "isAnimationActive", "legendType", "stroke", "xAxisId", "yAxisId"];
function _extends$2() {
  return _extends$2 = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends$2.apply(null, arguments);
}
function _objectWithoutProperties$3(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose$3(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose$3(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function ownKeys$2(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$2(Object(t), true).forEach(function(r2) {
      _defineProperty$2(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$2(e, r, t) {
  return (r = _toPropertyKey$2(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey$2(t) {
  var i = _toPrimitive$2(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$2(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function getLegendItemColor(stroke, fill) {
  return stroke && stroke !== "none" ? stroke : fill;
}
var computeLegendPayloadFromAreaData = (props) => {
  var {
    dataKey,
    name,
    stroke,
    fill,
    legendType,
    hide
  } = props;
  return [{
    inactive: hide,
    dataKey,
    type: legendType,
    color: getLegendItemColor(stroke, fill),
    value: getTooltipNameProp(name, dataKey),
    payload: props
  }];
};
var SetAreaTooltipEntrySettings = /* @__PURE__ */ reactExports.memo((_ref) => {
  var {
    dataKey,
    data,
    stroke,
    strokeWidth,
    fill,
    name,
    hide,
    unit,
    tooltipType,
    id
  } = _ref;
  var tooltipEntrySettings = {
    dataDefinedOnItem: data,
    getPosition: noop,
    settings: {
      stroke,
      strokeWidth,
      fill,
      dataKey,
      nameKey: void 0,
      name: getTooltipNameProp(name, dataKey),
      hide,
      type: tooltipType,
      color: getLegendItemColor(stroke, fill),
      unit,
      graphicalItemId: id
    }
  };
  return /* @__PURE__ */ reactExports.createElement(SetTooltipEntrySettings, {
    tooltipEntrySettings
  });
});
function AreaDotsWrapper(_ref2) {
  var {
    clipPathId,
    points,
    props
  } = _ref2;
  var {
    needClip,
    dot,
    dataKey
  } = props;
  var areaProps = svgPropertiesNoEvents(props);
  return /* @__PURE__ */ reactExports.createElement(Dots, {
    points,
    dot,
    className: "recharts-area-dots",
    dotClassName: "recharts-area-dot",
    dataKey,
    baseProps: areaProps,
    needClip,
    clipPathId
  });
}
function AreaLabelListProvider(_ref3) {
  var {
    showLabels,
    children,
    points
  } = _ref3;
  var labelListEntries = points.map((point) => {
    var _point$x, _point$y;
    var viewBox = {
      x: (_point$x = point.x) !== null && _point$x !== void 0 ? _point$x : 0,
      y: (_point$y = point.y) !== null && _point$y !== void 0 ? _point$y : 0,
      width: 0,
      lowerWidth: 0,
      upperWidth: 0,
      height: 0
    };
    return _objectSpread$2(_objectSpread$2({}, viewBox), {}, {
      value: point.value,
      payload: point.payload,
      parentViewBox: void 0,
      viewBox,
      fill: void 0
    });
  });
  return /* @__PURE__ */ reactExports.createElement(CartesianLabelListContextProvider, {
    value: showLabels ? labelListEntries : void 0
  }, children);
}
function StaticArea(_ref4) {
  var {
    points,
    baseLine,
    needClip,
    clipPathId,
    props
  } = _ref4;
  var {
    layout,
    type,
    stroke,
    connectNulls,
    isRange
  } = props;
  var {
    id
  } = props, propsWithoutId = _objectWithoutProperties$3(props, _excluded$3);
  var allOtherProps = svgPropertiesNoEvents(propsWithoutId);
  var propsWithEvents = svgPropertiesAndEvents(propsWithoutId);
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, (points === null || points === void 0 ? void 0 : points.length) > 1 && /* @__PURE__ */ reactExports.createElement(Layer, {
    clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : void 0
  }, /* @__PURE__ */ reactExports.createElement(Curve, _extends$2({}, propsWithEvents, {
    id,
    points,
    connectNulls,
    type,
    baseLine,
    layout,
    stroke: "none",
    className: "recharts-area-area"
  })), stroke !== "none" && /* @__PURE__ */ reactExports.createElement(Curve, _extends$2({}, allOtherProps, {
    className: "recharts-area-curve",
    layout,
    type,
    connectNulls,
    fill: "none",
    points
  })), stroke !== "none" && isRange && Array.isArray(baseLine) && /* @__PURE__ */ reactExports.createElement(Curve, _extends$2({}, allOtherProps, {
    className: "recharts-area-curve",
    layout,
    type,
    connectNulls,
    fill: "none",
    points: baseLine
  }))), /* @__PURE__ */ reactExports.createElement(AreaDotsWrapper, {
    points,
    props: propsWithoutId,
    clipPathId
  }));
}
function VerticalRect(_ref5) {
  var _points$, _points;
  var {
    alpha,
    baseLine,
    points,
    strokeWidth
  } = _ref5;
  var startY = (_points$ = points[0]) === null || _points$ === void 0 ? void 0 : _points$.y;
  var endY = (_points = points[points.length - 1]) === null || _points === void 0 ? void 0 : _points.y;
  if (!isWellBehavedNumber(startY) || !isWellBehavedNumber(endY)) {
    return null;
  }
  var height = alpha * Math.abs(startY - endY);
  var maxX = Math.max(...points.map((entry) => entry.x || 0));
  if (isNumber(baseLine)) {
    maxX = Math.max(baseLine, maxX);
  } else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
    maxX = Math.max(...baseLine.map((entry) => entry.x || 0), maxX);
  }
  if (isNumber(maxX)) {
    return /* @__PURE__ */ reactExports.createElement("rect", {
      x: 0,
      y: startY < endY ? startY : startY - height,
      width: maxX + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1),
      height: Math.floor(height)
    });
  }
  return null;
}
function HorizontalRect(_ref6) {
  var _points$2, _points2;
  var {
    alpha,
    baseLine,
    points,
    strokeWidth
  } = _ref6;
  var startX = (_points$2 = points[0]) === null || _points$2 === void 0 ? void 0 : _points$2.x;
  var endX = (_points2 = points[points.length - 1]) === null || _points2 === void 0 ? void 0 : _points2.x;
  if (!isWellBehavedNumber(startX) || !isWellBehavedNumber(endX)) {
    return null;
  }
  var width = alpha * Math.abs(startX - endX);
  var maxY = Math.max(...points.map((entry) => entry.y || 0));
  if (isNumber(baseLine)) {
    maxY = Math.max(baseLine, maxY);
  } else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
    maxY = Math.max(...baseLine.map((entry) => entry.y || 0), maxY);
  }
  if (isNumber(maxY)) {
    return /* @__PURE__ */ reactExports.createElement("rect", {
      x: startX < endX ? startX : startX - width,
      y: 0,
      width,
      height: Math.floor(maxY + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1))
    });
  }
  return null;
}
function ClipRect(_ref7) {
  var {
    alpha,
    layout,
    points,
    baseLine,
    strokeWidth
  } = _ref7;
  if (layout === "vertical") {
    return /* @__PURE__ */ reactExports.createElement(VerticalRect, {
      alpha,
      points,
      baseLine,
      strokeWidth
    });
  }
  return /* @__PURE__ */ reactExports.createElement(HorizontalRect, {
    alpha,
    points,
    baseLine,
    strokeWidth
  });
}
function AreaWithAnimation(_ref8) {
  var {
    needClip,
    clipPathId,
    props,
    previousPointsRef,
    previousBaselineRef
  } = _ref8;
  var {
    points,
    baseLine,
    isAnimationActive,
    animationBegin,
    animationDuration,
    animationEasing,
    onAnimationStart,
    onAnimationEnd
  } = props;
  var animationInput = reactExports.useMemo(() => ({
    points,
    baseLine
  }), [points, baseLine]);
  var animationId = useAnimationId(animationInput, "recharts-area-");
  var layout = useCartesianChartLayout();
  var [isAnimating, setIsAnimating] = reactExports.useState(false);
  var showLabels = !isAnimating;
  var handleAnimationEnd = reactExports.useCallback(() => {
    if (typeof onAnimationEnd === "function") {
      onAnimationEnd();
    }
    setIsAnimating(false);
  }, [onAnimationEnd]);
  var handleAnimationStart = reactExports.useCallback(() => {
    if (typeof onAnimationStart === "function") {
      onAnimationStart();
    }
    setIsAnimating(true);
  }, [onAnimationStart]);
  if (layout == null) {
    return null;
  }
  var prevPoints = previousPointsRef.current;
  var prevBaseLine = previousBaselineRef.current;
  return /* @__PURE__ */ reactExports.createElement(AreaLabelListProvider, {
    showLabels,
    points
  }, props.children, /* @__PURE__ */ reactExports.createElement(JavascriptAnimate, {
    animationId,
    begin: animationBegin,
    duration: animationDuration,
    isActive: isAnimationActive,
    easing: animationEasing,
    onAnimationEnd: handleAnimationEnd,
    onAnimationStart: handleAnimationStart,
    key: animationId
  }, (t) => {
    if (prevPoints) {
      var prevPointsDiffFactor = prevPoints.length / points.length;
      var stepPoints = (
        /*
         * Here it is important that at the very end of the animation, on the last frame,
         * we render the original points without any interpolation.
         * This is needed because the code above is checking for reference equality to decide if the animation should run
         * and if we create a new array instance (even if the numbers were the same)
         * then we would break animations.
         */
        t === 1 ? points : points.map((entry, index) => {
          var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
          if (prevPoints[prevPointIndex]) {
            var prev = prevPoints[prevPointIndex];
            return _objectSpread$2(_objectSpread$2({}, entry), {}, {
              x: interpolate(prev.x, entry.x, t),
              y: interpolate(prev.y, entry.y, t)
            });
          }
          return entry;
        })
      );
      var stepBaseLine;
      if (isNumber(baseLine)) {
        stepBaseLine = interpolate(prevBaseLine, baseLine, t);
      } else if (isNullish(baseLine) || isNan(baseLine)) {
        stepBaseLine = interpolate(prevBaseLine, 0, t);
      } else {
        stepBaseLine = baseLine.map((entry, index) => {
          var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
          if (Array.isArray(prevBaseLine) && prevBaseLine[prevPointIndex]) {
            var prev = prevBaseLine[prevPointIndex];
            return _objectSpread$2(_objectSpread$2({}, entry), {}, {
              x: interpolate(prev.x, entry.x, t),
              y: interpolate(prev.y, entry.y, t)
            });
          }
          return entry;
        });
      }
      if (t > 0) {
        previousPointsRef.current = stepPoints;
        previousBaselineRef.current = stepBaseLine;
      }
      return /* @__PURE__ */ reactExports.createElement(StaticArea, {
        points: stepPoints,
        baseLine: stepBaseLine,
        needClip,
        clipPathId,
        props
      });
    }
    if (t > 0) {
      previousPointsRef.current = points;
      previousBaselineRef.current = baseLine;
    }
    return /* @__PURE__ */ reactExports.createElement(Layer, null, isAnimationActive && /* @__PURE__ */ reactExports.createElement("defs", null, /* @__PURE__ */ reactExports.createElement("clipPath", {
      id: "animationClipPath-".concat(clipPathId)
    }, /* @__PURE__ */ reactExports.createElement(ClipRect, {
      alpha: t,
      points,
      baseLine,
      layout,
      strokeWidth: props.strokeWidth
    }))), /* @__PURE__ */ reactExports.createElement(Layer, {
      clipPath: "url(#animationClipPath-".concat(clipPathId, ")")
    }, /* @__PURE__ */ reactExports.createElement(StaticArea, {
      points,
      baseLine,
      needClip,
      clipPathId,
      props
    })));
  }), /* @__PURE__ */ reactExports.createElement(LabelListFromLabelProp, {
    label: props.label
  }));
}
function RenderArea(_ref9) {
  var {
    needClip,
    clipPathId,
    props
  } = _ref9;
  var previousPointsRef = reactExports.useRef(null);
  var previousBaselineRef = reactExports.useRef();
  return /* @__PURE__ */ reactExports.createElement(AreaWithAnimation, {
    needClip,
    clipPathId,
    props,
    previousPointsRef,
    previousBaselineRef
  });
}
class AreaWithState extends reactExports.PureComponent {
  render() {
    var {
      hide,
      dot,
      points,
      className,
      top,
      left,
      needClip,
      xAxisId,
      yAxisId,
      width,
      height,
      id,
      baseLine,
      zIndex
    } = this.props;
    if (hide) {
      return null;
    }
    var layerClass = clsx("recharts-area", className);
    var clipPathId = id;
    var {
      r,
      strokeWidth
    } = getRadiusAndStrokeWidthFromDot(dot);
    var clipDot = isClipDot(dot);
    var dotSize = r * 2 + strokeWidth;
    var activePointsClipPath = needClip ? "url(#clipPath-".concat(clipDot ? "" : "dots-").concat(clipPathId, ")") : void 0;
    return /* @__PURE__ */ reactExports.createElement(ZIndexLayer, {
      zIndex
    }, /* @__PURE__ */ reactExports.createElement(Layer, {
      className: layerClass
    }, needClip && /* @__PURE__ */ reactExports.createElement("defs", null, /* @__PURE__ */ reactExports.createElement(GraphicalItemClipPath, {
      clipPathId,
      xAxisId,
      yAxisId
    }), !clipDot && /* @__PURE__ */ reactExports.createElement("clipPath", {
      id: "clipPath-dots-".concat(clipPathId)
    }, /* @__PURE__ */ reactExports.createElement("rect", {
      x: left - dotSize / 2,
      y: top - dotSize / 2,
      width: width + dotSize,
      height: height + dotSize
    }))), /* @__PURE__ */ reactExports.createElement(RenderArea, {
      needClip,
      clipPathId,
      props: this.props
    })), /* @__PURE__ */ reactExports.createElement(ActivePoints, {
      points,
      mainColor: getLegendItemColor(this.props.stroke, this.props.fill),
      itemDataKey: this.props.dataKey,
      activeDot: this.props.activeDot,
      clipPath: activePointsClipPath
    }), this.props.isRange && Array.isArray(baseLine) && /* @__PURE__ */ reactExports.createElement(ActivePoints, {
      points: baseLine,
      mainColor: getLegendItemColor(this.props.stroke, this.props.fill),
      itemDataKey: this.props.dataKey,
      activeDot: this.props.activeDot,
      clipPath: activePointsClipPath
    }));
  }
}
var defaultAreaProps = {
  activeDot: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease",
  connectNulls: false,
  dot: false,
  fill: "#3182bd",
  fillOpacity: 0.6,
  hide: false,
  isAnimationActive: "auto",
  legendType: "line",
  stroke: "#3182bd",
  strokeWidth: 1,
  type: "linear",
  label: false,
  xAxisId: 0,
  yAxisId: 0,
  zIndex: DefaultZIndexes.area
};
function AreaImpl(props) {
  var _useAppSelector;
  var {
    activeDot,
    animationBegin,
    animationDuration,
    animationEasing,
    connectNulls,
    dot,
    fill,
    fillOpacity,
    hide,
    isAnimationActive,
    legendType,
    stroke,
    xAxisId,
    yAxisId
  } = props, everythingElse = _objectWithoutProperties$3(props, _excluded2$3);
  var layout = useChartLayout();
  var chartName = useChartName();
  var {
    needClip
  } = useNeedsClip(xAxisId, yAxisId);
  var isPanorama = useIsPanorama();
  var {
    points,
    isRange,
    baseLine
  } = (_useAppSelector = useAppSelector((state) => selectArea(state, props.id, isPanorama))) !== null && _useAppSelector !== void 0 ? _useAppSelector : {};
  var plotArea = usePlotArea();
  if (layout !== "horizontal" && layout !== "vertical" || plotArea == null) {
    return null;
  }
  if (chartName !== "AreaChart" && chartName !== "ComposedChart") {
    return null;
  }
  var {
    height,
    width,
    x: left,
    y: top
  } = plotArea;
  if (!points || !points.length) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(AreaWithState, _extends$2({}, everythingElse, {
    activeDot,
    animationBegin,
    animationDuration,
    animationEasing,
    baseLine,
    connectNulls,
    dot,
    fill,
    fillOpacity,
    height,
    hide,
    layout,
    isAnimationActive,
    isRange,
    legendType,
    needClip,
    points,
    stroke,
    width,
    left,
    top,
    xAxisId,
    yAxisId
  }));
}
var getBaseValue = (layout, chartBaseValue, itemBaseValue, xAxis, yAxis) => {
  var baseValue = itemBaseValue !== null && itemBaseValue !== void 0 ? itemBaseValue : chartBaseValue;
  if (isNumber(baseValue)) {
    return baseValue;
  }
  var numericAxis = layout === "horizontal" ? yAxis : xAxis;
  var domain = numericAxis.scale.domain();
  if (numericAxis.type === "number") {
    var domainMax = Math.max(domain[0], domain[1]);
    var domainMin = Math.min(domain[0], domain[1]);
    if (baseValue === "dataMin") {
      return domainMin;
    }
    if (baseValue === "dataMax") {
      return domainMax;
    }
    return domainMax < 0 ? domainMax : Math.max(Math.min(domain[0], domain[1]), 0);
  }
  if (baseValue === "dataMin") {
    return domain[0];
  }
  if (baseValue === "dataMax") {
    return domain[1];
  }
  return domain[0];
};
function computeArea(_ref0) {
  var {
    areaSettings: {
      connectNulls,
      baseValue: itemBaseValue,
      dataKey
    },
    stackedData,
    layout,
    chartBaseValue,
    xAxis,
    yAxis,
    displayedData,
    dataStartIndex,
    xAxisTicks,
    yAxisTicks,
    bandSize
  } = _ref0;
  var hasStack = stackedData && stackedData.length;
  var baseValue = getBaseValue(layout, chartBaseValue, itemBaseValue, xAxis, yAxis);
  var isHorizontalLayout = layout === "horizontal";
  var isRange = false;
  var points = displayedData.map((entry, index) => {
    var _valueAsArray$, _valueAsArray, _xAxis$scale$map;
    var valueAsArray;
    if (hasStack) {
      valueAsArray = stackedData[dataStartIndex + index];
    } else {
      var rawValue = getValueByDataKey(entry, dataKey);
      if (!Array.isArray(rawValue)) {
        valueAsArray = [baseValue, rawValue];
      } else {
        valueAsArray = rawValue;
        isRange = true;
      }
    }
    var value1 = (_valueAsArray$ = (_valueAsArray = valueAsArray) === null || _valueAsArray === void 0 ? void 0 : _valueAsArray[1]) !== null && _valueAsArray$ !== void 0 ? _valueAsArray$ : null;
    var isBreakPoint = value1 == null || hasStack && !connectNulls && getValueByDataKey(entry, dataKey) == null;
    if (isHorizontalLayout) {
      var _yAxis$scale$map;
      return {
        x: getCateCoordinateOfLine({
          axis: xAxis,
          ticks: xAxisTicks,
          bandSize,
          entry,
          index
        }),
        y: isBreakPoint ? null : (_yAxis$scale$map = yAxis.scale.map(value1)) !== null && _yAxis$scale$map !== void 0 ? _yAxis$scale$map : null,
        value: valueAsArray,
        payload: entry
      };
    }
    return {
      x: isBreakPoint ? null : (_xAxis$scale$map = xAxis.scale.map(value1)) !== null && _xAxis$scale$map !== void 0 ? _xAxis$scale$map : null,
      y: getCateCoordinateOfLine({
        axis: yAxis,
        ticks: yAxisTicks,
        bandSize,
        entry,
        index
      }),
      value: valueAsArray,
      payload: entry
    };
  });
  var baseLine;
  if (hasStack || isRange) {
    baseLine = points.map((entry) => {
      var _xAxis$scale$map2;
      var x = Array.isArray(entry.value) ? entry.value[0] : null;
      if (isHorizontalLayout) {
        var _yAxis$scale$map2;
        return {
          x: entry.x,
          y: x != null && entry.y != null ? (_yAxis$scale$map2 = yAxis.scale.map(x)) !== null && _yAxis$scale$map2 !== void 0 ? _yAxis$scale$map2 : null : null,
          payload: entry.payload
        };
      }
      return {
        x: x != null ? (_xAxis$scale$map2 = xAxis.scale.map(x)) !== null && _xAxis$scale$map2 !== void 0 ? _xAxis$scale$map2 : null : null,
        y: entry.y,
        payload: entry.payload
      };
    });
  } else {
    baseLine = isHorizontalLayout ? yAxis.scale.map(baseValue) : xAxis.scale.map(baseValue);
  }
  return {
    points,
    baseLine: baseLine !== null && baseLine !== void 0 ? baseLine : 0,
    isRange
  };
}
function AreaFn(outsideProps) {
  var props = resolveDefaultProps(outsideProps, defaultAreaProps);
  var isPanorama = useIsPanorama();
  return /* @__PURE__ */ reactExports.createElement(RegisterGraphicalItemId, {
    id: props.id,
    type: "area"
  }, (id) => /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement(SetLegendPayload, {
    legendPayload: computeLegendPayloadFromAreaData(props)
  }), /* @__PURE__ */ reactExports.createElement(SetAreaTooltipEntrySettings, {
    dataKey: props.dataKey,
    data: props.data,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    fill: props.fill,
    name: props.name,
    hide: props.hide,
    unit: props.unit,
    tooltipType: props.tooltipType,
    id
  }), /* @__PURE__ */ reactExports.createElement(SetCartesianGraphicalItem, {
    type: "area",
    id,
    data: props.data,
    dataKey: props.dataKey,
    xAxisId: props.xAxisId,
    yAxisId: props.yAxisId,
    zAxisId: 0,
    stackId: getNormalizedStackId(props.stackId),
    hide: props.hide,
    barSize: void 0,
    baseValue: props.baseValue,
    isPanorama,
    connectNulls: props.connectNulls
  }), /* @__PURE__ */ reactExports.createElement(AreaImpl, _extends$2({}, props, {
    id
  }))));
}
var Area = /* @__PURE__ */ reactExports.memo(AreaFn, propsAreEqual);
Area.displayName = "Area";
var _excluded$2 = ["domain", "range"], _excluded2$2 = ["domain", "range"];
function _objectWithoutProperties$2(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose$2(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose$2(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function shortArraysAreEqual(arr1, arr2) {
  if (arr1 === arr2) {
    return true;
  }
  if (Array.isArray(arr1) && arr1.length === 2 && Array.isArray(arr2) && arr2.length === 2) {
    return arr1[0] === arr2[0] && arr1[1] === arr2[1];
  }
  return false;
}
function axisPropsAreEqual(prevProps, nextProps) {
  if (prevProps === nextProps) {
    return true;
  }
  var {
    domain: prevDomain,
    range: prevRange
  } = prevProps, prevRest = _objectWithoutProperties$2(prevProps, _excluded$2);
  var {
    domain: nextDomain,
    range: nextRange
  } = nextProps, nextRest = _objectWithoutProperties$2(nextProps, _excluded2$2);
  if (!shortArraysAreEqual(prevDomain, nextDomain)) {
    return false;
  }
  if (!shortArraysAreEqual(prevRange, nextRange)) {
    return false;
  }
  return propsAreEqual(prevRest, nextRest);
}
var _excluded$1 = ["type"], _excluded2$1 = ["dangerouslySetInnerHTML", "ticks", "scale"], _excluded3$1 = ["id", "scale"];
function _extends$1() {
  return _extends$1 = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends$1.apply(null, arguments);
}
function ownKeys$1(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$1(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$1(Object(t), true).forEach(function(r2) {
      _defineProperty$1(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$1(e, r, t) {
  return (r = _toPropertyKey$1(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey$1(t) {
  var i = _toPrimitive$1(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$1(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _objectWithoutProperties$1(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose$1(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose$1(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function SetXAxisSettings(props) {
  var dispatch = useAppDispatch();
  var prevSettingsRef = reactExports.useRef(null);
  var layout = useCartesianChartLayout();
  var {
    type: typeFromProps
  } = props, restProps = _objectWithoutProperties$1(props, _excluded$1);
  var evaluatedType = getAxisTypeBasedOnLayout(layout, "xAxis", typeFromProps);
  var settings = reactExports.useMemo(() => {
    if (evaluatedType == null) {
      return void 0;
    }
    return _objectSpread$1(_objectSpread$1({}, restProps), {}, {
      type: evaluatedType
    });
  }, [restProps, evaluatedType]);
  reactExports.useLayoutEffect(() => {
    if (settings == null) {
      return;
    }
    if (prevSettingsRef.current === null) {
      dispatch(addXAxis(settings));
    } else if (prevSettingsRef.current !== settings) {
      dispatch(replaceXAxis({
        prev: prevSettingsRef.current,
        next: settings
      }));
    }
    prevSettingsRef.current = settings;
  }, [settings, dispatch]);
  reactExports.useLayoutEffect(() => {
    return () => {
      if (prevSettingsRef.current) {
        dispatch(removeXAxis(prevSettingsRef.current));
        prevSettingsRef.current = null;
      }
    };
  }, [dispatch]);
  return null;
}
var XAxisImpl = (props) => {
  var {
    xAxisId,
    className
  } = props;
  var viewBox = useAppSelector(selectAxisViewBox);
  var isPanorama = useIsPanorama();
  var axisType = "xAxis";
  var cartesianTickItems = useAppSelector((state) => selectTicksOfAxis(state, axisType, xAxisId, isPanorama));
  var axisSize = useAppSelector((state) => selectXAxisSize(state, xAxisId));
  var position = useAppSelector((state) => selectXAxisPosition(state, xAxisId));
  var synchronizedSettings = useAppSelector((state) => selectXAxisSettingsNoDefaults(state, xAxisId));
  if (axisSize == null || position == null || synchronizedSettings == null) {
    return null;
  }
  var {
    dangerouslySetInnerHTML,
    ticks,
    scale: del
  } = props, allOtherProps = _objectWithoutProperties$1(props, _excluded2$1);
  var {
    id,
    scale: del2
  } = synchronizedSettings, restSynchronizedSettings = _objectWithoutProperties$1(synchronizedSettings, _excluded3$1);
  return /* @__PURE__ */ reactExports.createElement(CartesianAxis, _extends$1({}, allOtherProps, restSynchronizedSettings, {
    x: position.x,
    y: position.y,
    width: axisSize.width,
    height: axisSize.height,
    className: clsx("recharts-".concat(axisType, " ").concat(axisType), className),
    viewBox,
    ticks: cartesianTickItems,
    axisType,
    axisId: xAxisId
  }));
};
var xAxisDefaultProps = {
  allowDataOverflow: implicitXAxis.allowDataOverflow,
  allowDecimals: implicitXAxis.allowDecimals,
  allowDuplicatedCategory: implicitXAxis.allowDuplicatedCategory,
  angle: implicitXAxis.angle,
  axisLine: defaultCartesianAxisProps.axisLine,
  height: implicitXAxis.height,
  hide: false,
  includeHidden: implicitXAxis.includeHidden,
  interval: implicitXAxis.interval,
  label: false,
  minTickGap: implicitXAxis.minTickGap,
  mirror: implicitXAxis.mirror,
  orientation: implicitXAxis.orientation,
  padding: implicitXAxis.padding,
  reversed: implicitXAxis.reversed,
  scale: implicitXAxis.scale,
  tick: implicitXAxis.tick,
  tickCount: implicitXAxis.tickCount,
  tickLine: defaultCartesianAxisProps.tickLine,
  tickSize: defaultCartesianAxisProps.tickSize,
  type: implicitXAxis.type,
  niceTicks: implicitXAxis.niceTicks,
  xAxisId: 0
};
var XAxisSettingsDispatcher = (outsideProps) => {
  var props = resolveDefaultProps(outsideProps, xAxisDefaultProps);
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement(SetXAxisSettings, {
    allowDataOverflow: props.allowDataOverflow,
    allowDecimals: props.allowDecimals,
    allowDuplicatedCategory: props.allowDuplicatedCategory,
    angle: props.angle,
    dataKey: props.dataKey,
    domain: props.domain,
    height: props.height,
    hide: props.hide,
    id: props.xAxisId,
    includeHidden: props.includeHidden,
    interval: props.interval,
    minTickGap: props.minTickGap,
    mirror: props.mirror,
    name: props.name,
    orientation: props.orientation,
    padding: props.padding,
    reversed: props.reversed,
    scale: props.scale,
    tick: props.tick,
    tickCount: props.tickCount,
    tickFormatter: props.tickFormatter,
    ticks: props.ticks,
    type: props.type,
    unit: props.unit,
    niceTicks: props.niceTicks
  }), /* @__PURE__ */ reactExports.createElement(XAxisImpl, props));
};
var XAxis = /* @__PURE__ */ reactExports.memo(XAxisSettingsDispatcher, axisPropsAreEqual);
XAxis.displayName = "XAxis";
var _excluded = ["type"], _excluded2 = ["dangerouslySetInnerHTML", "ticks", "scale"], _excluded3 = ["id", "scale"];
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function SetYAxisSettings(props) {
  var dispatch = useAppDispatch();
  var prevSettingsRef = reactExports.useRef(null);
  var layout = useCartesianChartLayout();
  var {
    type: typeFromProps
  } = props, restProps = _objectWithoutProperties(props, _excluded);
  var evaluatedType = getAxisTypeBasedOnLayout(layout, "yAxis", typeFromProps);
  var settings = reactExports.useMemo(() => {
    if (evaluatedType == null) {
      return void 0;
    }
    return _objectSpread(_objectSpread({}, restProps), {}, {
      type: evaluatedType
    });
  }, [evaluatedType, restProps]);
  reactExports.useLayoutEffect(() => {
    if (settings == null) {
      return;
    }
    if (prevSettingsRef.current === null) {
      dispatch(addYAxis(settings));
    } else if (prevSettingsRef.current !== settings) {
      dispatch(replaceYAxis({
        prev: prevSettingsRef.current,
        next: settings
      }));
    }
    prevSettingsRef.current = settings;
  }, [settings, dispatch]);
  reactExports.useLayoutEffect(() => {
    return () => {
      if (prevSettingsRef.current) {
        dispatch(removeYAxis(prevSettingsRef.current));
        prevSettingsRef.current = null;
      }
    };
  }, [dispatch]);
  return null;
}
function YAxisImpl(props) {
  var {
    yAxisId,
    className,
    width,
    label
  } = props;
  var cartesianAxisRef = reactExports.useRef(null);
  var labelRef = reactExports.useRef(null);
  var viewBox = useAppSelector(selectAxisViewBox);
  var isPanorama = useIsPanorama();
  var dispatch = useAppDispatch();
  var axisType = "yAxis";
  var axisSize = useAppSelector((state) => selectYAxisSize(state, yAxisId));
  var position = useAppSelector((state) => selectYAxisPosition(state, yAxisId));
  var cartesianTickItems = useAppSelector((state) => selectTicksOfAxis(state, axisType, yAxisId, isPanorama));
  var synchronizedSettings = useAppSelector((state) => selectYAxisSettingsNoDefaults(state, yAxisId));
  reactExports.useLayoutEffect(() => {
    if (width !== "auto" || !axisSize || isLabelContentAFunction(label) || /* @__PURE__ */ reactExports.isValidElement(label) || synchronizedSettings == null) {
      return;
    }
    var axisComponent = cartesianAxisRef.current;
    if (!axisComponent) {
      return;
    }
    var updatedYAxisWidth = axisComponent.getCalculatedWidth();
    if (Math.round(axisSize.width) !== Math.round(updatedYAxisWidth)) {
      dispatch(updateYAxisWidth({
        id: yAxisId,
        width: updatedYAxisWidth
      }));
    }
  }, [
    // The dependency on cartesianAxisRef.current is not needed because useLayoutEffect will run after every render.
    // The ref will be populated by then.
    // To re-run this effect when ticks change, we can depend on the ticks array from the store.
    cartesianTickItems,
    axisSize,
    dispatch,
    label,
    yAxisId,
    width,
    synchronizedSettings
  ]);
  if (axisSize == null || position == null || synchronizedSettings == null) {
    return null;
  }
  var {
    dangerouslySetInnerHTML,
    ticks,
    scale: del
  } = props, allOtherProps = _objectWithoutProperties(props, _excluded2);
  var {
    id,
    scale: del2
  } = synchronizedSettings, restSynchronizedSettings = _objectWithoutProperties(synchronizedSettings, _excluded3);
  return /* @__PURE__ */ reactExports.createElement(CartesianAxis, _extends({}, allOtherProps, restSynchronizedSettings, {
    ref: cartesianAxisRef,
    labelRef,
    x: position.x,
    y: position.y,
    tickTextProps: width === "auto" ? {
      width: void 0
    } : {
      width
    },
    width: axisSize.width,
    height: axisSize.height,
    className: clsx("recharts-".concat(axisType, " ").concat(axisType), className),
    viewBox,
    ticks: cartesianTickItems,
    axisType,
    axisId: yAxisId
  }));
}
var yAxisDefaultProps = {
  allowDataOverflow: implicitYAxis.allowDataOverflow,
  allowDecimals: implicitYAxis.allowDecimals,
  allowDuplicatedCategory: implicitYAxis.allowDuplicatedCategory,
  angle: implicitYAxis.angle,
  axisLine: defaultCartesianAxisProps.axisLine,
  hide: false,
  includeHidden: implicitYAxis.includeHidden,
  interval: implicitYAxis.interval,
  label: false,
  minTickGap: implicitYAxis.minTickGap,
  mirror: implicitYAxis.mirror,
  orientation: implicitYAxis.orientation,
  padding: implicitYAxis.padding,
  reversed: implicitYAxis.reversed,
  scale: implicitYAxis.scale,
  tick: implicitYAxis.tick,
  tickCount: implicitYAxis.tickCount,
  tickLine: defaultCartesianAxisProps.tickLine,
  tickSize: defaultCartesianAxisProps.tickSize,
  type: implicitYAxis.type,
  niceTicks: implicitYAxis.niceTicks,
  width: implicitYAxis.width,
  yAxisId: 0
};
var YAxisSettingsDispatcher = (outsideProps) => {
  var props = resolveDefaultProps(outsideProps, yAxisDefaultProps);
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement(SetYAxisSettings, {
    interval: props.interval,
    id: props.yAxisId,
    scale: props.scale,
    type: props.type,
    domain: props.domain,
    allowDataOverflow: props.allowDataOverflow,
    dataKey: props.dataKey,
    allowDuplicatedCategory: props.allowDuplicatedCategory,
    allowDecimals: props.allowDecimals,
    tickCount: props.tickCount,
    padding: props.padding,
    includeHidden: props.includeHidden,
    reversed: props.reversed,
    ticks: props.ticks,
    width: props.width,
    orientation: props.orientation,
    mirror: props.mirror,
    hide: props.hide,
    unit: props.unit,
    name: props.name,
    angle: props.angle,
    minTickGap: props.minTickGap,
    tick: props.tick,
    tickFormatter: props.tickFormatter,
    niceTicks: props.niceTicks
  }), /* @__PURE__ */ reactExports.createElement(YAxisImpl, props));
};
var YAxis = /* @__PURE__ */ reactExports.memo(YAxisSettingsDispatcher, axisPropsAreEqual);
YAxis.displayName = "YAxis";
var allowedTooltipTypes = ["axis"];
var AreaChart = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  return /* @__PURE__ */ reactExports.createElement(CartesianChart, {
    chartName: "AreaChart",
    defaultTooltipEventType: "axis",
    validateTooltipEventTypes: allowedTooltipTypes,
    tooltipPayloadSearcher: arrayTooltipSearcher,
    categoricalChartProps: props,
    ref
  });
});
export {
  AreaChart as A,
  XAxis as X,
  YAxis as Y,
  Area as a
};
