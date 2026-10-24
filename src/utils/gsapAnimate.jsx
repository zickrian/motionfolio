import React, {
  Children,
  Fragment,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const MOTION_KEYS = new Set([
  "initial",
  "animate",
  "exit",
  "transition",
  "whileInView",
  "viewport",
  "whileHover",
  "variants",
  "layoutId",
  "custom",
  "__motionExit",
]);

const TRANSFORM_KEYS = new Set(["x", "y", "scale", "rotate"]);

class MotionValue {
  constructor(initial) {
    this.current = initial;
    this.subscribers = new Set();
  }

  get() {
    return this.current;
  }

  set(value) {
    this.current = value;
    this.subscribers.forEach((subscriber) => subscriber(value));
  }

  onChange(subscriber) {
    this.subscribers.add(subscriber);
    subscriber(this.current);
    return () => this.subscribers.delete(subscriber);
  }
}

const isMotionValue = (value) => value instanceof MotionValue;

const resolveEase = (ease) => {
  if (!ease) return "power3.out";
  if (Array.isArray(ease)) return "power3.out";
  if (ease === "easeOut") return "power3.out";
  if (ease === "easeIn") return "power3.in";
  if (ease === "easeInOut") return "power3.inOut";
  return ease;
};

const resolveTransition = (transition = {}) => {
  const nested =
    Object.values(transition).find(
      (value) =>
        value &&
        typeof value === "object" &&
        (value.duration !== undefined || value.delay !== undefined || value.ease !== undefined),
    ) || {};

  return {
    duration: transition.duration ?? nested.duration ?? 0.6,
    delay: transition.delay ?? nested.delay ?? 0,
    ease: resolveEase(transition.ease ?? nested.ease),
  };
};

const getTransitionMs = (transition = {}) => {
  const resolved = resolveTransition(transition);
  return ((resolved.duration || 0) + (resolved.delay || 0)) * 1000;
};

const normalizeVars = (vars = {}) => {
  if (!vars || typeof vars !== "object") return {};
  const next = { ...vars };
  if (next.y !== undefined && typeof next.y === "string" && next.y.endsWith("%")) {
    next.yPercent = Number(next.y.slice(0, -1));
    delete next.y;
  }
  if (next.x !== undefined && typeof next.x === "string" && next.x.endsWith("%")) {
    next.xPercent = Number(next.x.slice(0, -1));
    delete next.x;
  }
  return next;
};

const resolveVariant = (state, variants, custom) => {
  if (!state || state === false) return null;
  if (typeof state === "string") {
    const variant = variants?.[state];
    return typeof variant === "function" ? variant(custom) : variant;
  }
  return state;
};

const loadGsap = async () => {
  const module = await import("gsap");
  return module.default || module.gsap;
};

const animateElement = async (element, vars, transition) => {
  if (!element || !vars) return;
  const gsap = await loadGsap();
  gsap.to(element, {
    ...normalizeVars(vars),
    ...resolveTransition(transition),
    overwrite: "auto",
  });
};

const setElement = async (element, vars) => {
  if (!element || !vars) return;
  const gsap = await loadGsap();
  gsap.set(element, normalizeVars(vars));
};

const interpolate = (value, inputRange, outputRange) => {
  const [inMin, inMax] = inputRange;
  const [outMin, outMax] = outputRange;
  const progress = inMax === inMin ? 1 : (value - inMin) / (inMax - inMin);
  const clamped = Math.max(0, Math.min(1, progress));

  if (typeof outMin === "string" && typeof outMax === "string") {
    const min = parseFloat(outMin);
    const max = parseFloat(outMax);
    const unit = outMax.replace(String(max), "") || outMin.replace(String(min), "");
    return `${min + (max - min) * clamped}${unit}`;
  }

  return outMin + (outMax - outMin) * clamped;
};

const buildTransform = (values) => {
  const transforms = [];
  if (values.x !== undefined) transforms.push(`translateX(${formatTransformValue(values.x)})`);
  if (values.y !== undefined) transforms.push(`translateY(${formatTransformValue(values.y)})`);
  if (values.scale !== undefined) transforms.push(`scale(${values.scale})`);
  if (values.rotate !== undefined) transforms.push(`rotate(${values.rotate}deg)`);
  return transforms.join(" ");
};

const formatTransformValue = (value) => (typeof value === "number" ? `${value}px` : value);

const resolveStaticStyle = (style, motionValuesRef) => {
  if (!style) return style;
  const next = {};

  Object.entries(style).forEach(([key, value]) => {
    if (isMotionValue(value)) {
      motionValuesRef.current[key] = value;
      return;
    }
    if (!TRANSFORM_KEYS.has(key)) {
      next[key] = value;
    }
  });

  return next;
};

const applyMotionStyle = (element, values) => {
  if (!element) return;
  const transform = buildTransform(values);
  if (transform) {
    element.style.transform = transform;
  }
};

const createMotionComponent = (Tag) => {
  const MotionComponent = forwardRef(function MotionComponent(props, forwardedRef) {
    const {
      initial,
      animate,
      transition,
      whileInView,
      viewport,
      whileHover,
      variants,
      custom,
      __motionExit,
      style,
      onMouseEnter,
      onMouseLeave,
      ...rest
    } = props;

    const localRef = useRef(null);
    const motionValuesRef = useRef({});
    const baseTransformRef = useRef({});
    const setRef = (node) => {
      localRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    const domProps = {};
    Object.entries(rest).forEach(([key, value]) => {
      if (!MOTION_KEYS.has(key)) domProps[key] = value;
    });

    const staticStyle = resolveStaticStyle(style, motionValuesRef);

    useEffect(() => {
      const element = localRef.current;
      if (!element) return undefined;

      const unsubscribers = Object.entries(motionValuesRef.current).map(([key, motionValue]) =>
        motionValue.onChange((value) => {
          baseTransformRef.current[key] = value;
          applyMotionStyle(element, baseTransformRef.current);
        }),
      );

      return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
    }, []);

    useEffect(() => {
      const element = localRef.current;
      if (!element) return undefined;

      let cancelled = false;
      let observer;

      const run = async () => {
        const exitVars = resolveVariant(props.exit, variants, custom);
        if (__motionExit) {
          if (exitVars) animateElement(element, exitVars, transition);
          return;
        }

        const initialVars = resolveVariant(initial, variants, custom);
        const animateVars = resolveVariant(animate, variants, custom);
        const inViewVars = resolveVariant(whileInView, variants, custom);

        if (initialVars) await setElement(element, initialVars);
        if (cancelled) return;

        if (inViewVars) {
          observer = new IntersectionObserver(
            (entries) => {
              const entry = entries[0];
              if (!entry?.isIntersecting) return;
              animateElement(element, inViewVars, transition);
              if (viewport?.once !== false) observer.disconnect();
            },
            {
              threshold: viewport?.amount ?? 0.1,
              rootMargin: viewport?.margin ?? "0px",
            },
          );
          observer.observe(element);
          return;
        }

        if (animateVars) {
          animateElement(element, animateVars, transition);
        }
      };

      run();

      return () => {
        cancelled = true;
        if (observer) observer.disconnect();
      };
    }, [
      __motionExit,
      animate,
      custom,
      initial,
      props.exit,
      transition,
      variants,
      viewport,
      whileInView,
    ]);

    const handleMouseEnter = (event) => {
      if (whileHover)
        animateElement(localRef.current, whileHover, { duration: 0.25, ease: "power3.out" });
      onMouseEnter?.(event);
    };

    const handleMouseLeave = (event) => {
      if (whileHover) {
        const target =
          resolveVariant(animate, variants, custom) ||
          resolveVariant(whileInView, variants, custom) ||
          {};
        animateElement(localRef.current, target, { duration: 0.25, ease: "power3.out" });
      }
      onMouseLeave?.(event);
    };

    return (
      <Tag
        ref={setRef}
        style={staticStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...domProps}
      />
    );
  });

  MotionComponent.__isGsapMotion = true;
  return MotionComponent;
};

export const Gsap = new Proxy(
  {},
  {
    get: (target, tag) => {
      if (!target[tag]) target[tag] = createMotionComponent(tag);
      return target[tag];
    },
  },
);

const toPresenceItems = (children) =>
  Children.toArray(children)
    .filter(Boolean)
    .map((child) => ({
      child,
      key: isValidElement(child) && child.key != null ? child.key : "__default",
      exiting: false,
    }));

const markExiting = (node) => {
  if (!isValidElement(node)) return node;

  const childProps = {};
  if (node.props.children) {
    childProps.children = Children.map(node.props.children, markExiting);
  }

  if (node.type?.__isGsapMotion) {
    return cloneElement(node, {
      ...childProps,
      __motionExit: true,
    });
  }

  return cloneElement(node, childProps);
};

const getExitMs = (node) => {
  if (!isValidElement(node)) return 0;

  const ownMs = node.props.exit ? getTransitionMs(node.props.transition) : 0;
  const childMs = Children.toArray(node.props.children).reduce(
    (max, child) => Math.max(max, getExitMs(child)),
    0,
  );

  return Math.max(ownMs, childMs);
};

export const GsapPresence = ({ children, mode, onExitComplete }) => {
  const visibleItems = toPresenceItems(children);
  const visibleKeys = new Set(visibleItems.map((item) => item.key));
  const previousItemsRef = useRef(visibleItems);
  const timeoutRef = useRef(null);
  const [exitingItems, setExitingItems] = useState([]);

  useEffect(() => {
    const removedItems = previousItemsRef.current.filter((item) => !visibleKeys.has(item.key));
    previousItemsRef.current = visibleItems;

    if (!removedItems.length) {
      setExitingItems((currentItems) => {
        const nextItems = currentItems.filter((item) => !visibleKeys.has(item.key));
        return nextItems.length === currentItems.length ? currentItems : nextItems;
      });
      return;
    }

    const nextExitingItems = removedItems.map((item) => ({
      ...item,
      child: markExiting(item.child),
      exiting: true,
    }));

    const exitMs = Math.max(...removedItems.map((item) => getExitMs(item.child)), 0);
    setExitingItems(nextExitingItems);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      setExitingItems([]);
      onExitComplete?.();
    }, exitMs + 80);
  }, [children, onExitComplete, visibleItems, visibleKeys]);

  useEffect(
    () => () => {
      clearTimeout(timeoutRef.current);
    },
    [],
  );

  const shouldWait = mode === "wait" && exitingItems.length > 0;
  return (
    <Fragment>
      {!shouldWait && visibleItems.map((item) => item.child)}
      {exitingItems.map((item) => item.child)}
    </Fragment>
  );
};

export const useGsapMotionValue = (initial) => useMemo(() => new MotionValue(initial), [initial]);

export const useGsapReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  return reduced;
};

export const useGsapScroll = ({ target } = {}) => {
  const scrollYProgress = useGsapMotionValue(0);

  useEffect(() => {
    const update = () => {
      const element = target?.current;
      if (!element) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scrollYProgress.set(max > 0 ? window.scrollY / max : 0);
        return;
      }

      const rect = element.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const passed = window.innerHeight - rect.top;
      scrollYProgress.set(Math.max(0, Math.min(1, passed / total)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [scrollYProgress, target]);

  return { scrollYProgress };
};

export const useGsapTransform = (source, inputRange, outputRange) => {
  const derived = useGsapMotionValue(interpolate(source.get(), inputRange, outputRange));

  useEffect(
    () =>
      source.onChange((value) => {
        derived.set(interpolate(value, inputRange, outputRange));
      }),
    [derived, inputRange, outputRange, source],
  );

  return derived;
};

export const useGsapInView = (ref, options = {}) => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = Boolean(entries[0]?.isIntersecting);
        if (visible) setInView(true);
        if (visible && options.once) observer.disconnect();
      },
      {
        threshold: options.amount ?? 0.1,
        rootMargin: options.margin ?? "0px",
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.amount, options.margin, options.once, ref]);

  return inView;
};
