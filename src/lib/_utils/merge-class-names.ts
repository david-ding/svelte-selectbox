import type { ClassNames } from "../types";

const mergeClassNamesObj = (classNamesArray: Array<ClassNames>): ClassNames => {
  return classNamesArray
    .filter((className) => className != null)
    .reduce((result: ClassNames, currentClassNames: ClassNames) => {
      if (Array.isArray(currentClassNames)) {
        return Object.assign(result, mergeClassNamesObj(currentClassNames));
      }
      if (typeof currentClassNames === "object") {
        return Object.assign(result, currentClassNames);
      }
      if (/\s/.test(currentClassNames)) {
        return Object.assign(
          result,
          mergeClassNamesObj(currentClassNames.split(/\s+/)),
        );
      }
      return Object.assign(result, { [currentClassNames]: true });
    }, {});
};

const mergeClassNames = (classNamesArray: Array<ClassNames>): string => {
  const classNamesObj = mergeClassNamesObj(classNamesArray);
  return Object.keys(classNamesObj)
    .filter((key) => classNamesObj[key])
    .sort()
    .join(" ");
};

// TODO: remove
export default mergeClassNames;
