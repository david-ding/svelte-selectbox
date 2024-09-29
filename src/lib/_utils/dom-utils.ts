const isInScrollView = (element: HTMLElement, parent: HTMLElement, partial?: boolean): boolean => {
  if (!parent.contains(element)) {
    return false;
  }

  if (partial) {
    const lowerBoundary = parent.scrollTop + parent.clientHeight;
    const upperBoundary = parent.scrollTop - element.clientHeight;
    return element.offsetTop <= lowerBoundary && element.offsetTop >= upperBoundary;
  }

  const lowerBoundary = parent.scrollTop + parent.clientHeight - element.clientHeight;
  const upperBoundary = parent.scrollTop;
  return element.offsetTop <= lowerBoundary && element.offsetTop >= upperBoundary;
};

export const scrollToItem = (
  item: HTMLElement,
  parent: HTMLElement,
  alignToTop: boolean = true,
): void => {
  if (!item || isInScrollView(item, parent)) return;

  if (alignToTop) {
    parent.scrollTop = item.offsetTop;
  } else {
    parent.scrollTop = item.offsetTop + item.offsetHeight - parent.clientHeight;
  }
};

const convertRemToPx = (rem: number): number => {
  const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return rem * fontSize;
};

const convertEmToPx = (em: number, element: HTMLElement | undefined): number => {
  if (!element) {
    throw new Error('element is not specified');
  }

  if (!element.parentElement) {
    throw new Error('element does not have a parent element');
  }

  const fontSize = parseFloat(getComputedStyle(element.parentElement).fontSize) || 16;
  return em * fontSize;
};

export const convertLengthToPx = (length: string, parent?: HTMLElement): number => {
  if (!length) return 0;

  const matches = /^(-?[\d.]+)(px|(r)?em)$/.exec(length);
  if (!matches) {
    throw new Error('Invalid length: ' + length);
  }

  const [, value, unit] = matches;
  switch (unit) {
    case 'rem': {
      return convertRemToPx(parseFloat(value));
    }
    case 'em': {
      return convertEmToPx(parseFloat(value), parent);
    }
    case 'px': {
      return parseFloat(value);
    }
    default: {
      throw new Error('Invalid unit: ' + unit);
    }
  }
};

export const contentBoxHeightToBorderBoxHeight = (
  element: HTMLElement,
  contentBoxHeight: number,
): number => {
  const { borderTopWidth, borderBottomWidth, paddingTop, paddingBottom } =
    getComputedStyle(element);
  // console.table({
  //   borderTopWidth,
  //   borderBottomWidth,
  //   paddingTop,
  //   paddingBottom,
  //   contentBoxHeight,
  // });
  return (
    contentBoxHeight +
    parseFloat(borderTopWidth || '0') +
    parseFloat(borderBottomWidth || '0') +
    parseFloat(paddingTop || '0') +
    parseFloat(paddingBottom || '0')
  );
};

export const generateHtmlId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
