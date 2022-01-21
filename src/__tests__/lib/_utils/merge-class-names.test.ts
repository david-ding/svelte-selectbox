import mergeClassNames from "../../../lib/_utils/merge-class-names";

describe("mergeClassNames", () => {
  describe("when input is an array of strings", () => {
    it("should return the merged class names object", () => {
      const input = ["class-1", "class-2", "class-3"];
      expect(mergeClassNames(input)).toBe("class-1 class-2 class-3");
    });

    describe("when there are space separated strings", () => {
      it("should delimit the class names by space", () => {
        const input = ["class-1", "class-2 class-3", null, undefined];
        expect(mergeClassNames(input)).toBe("class-1 class-2 class-3");
      });
    });

    describe("when there are nil values", () => {
      it("should ignore the nil values", () => {
        const input = ["class-1", "class-2", null, undefined];
        expect(mergeClassNames(input)).toBe("class-1 class-2");
      });
    });
  });

  describe("when input is an array of arrays of strings", () => {
    it("should return the merged class names object", () => {
      const input = [
        ["class-1", "class-2"],
        ["class-1", "class-3 class-4"],
      ];
      expect(mergeClassNames(input)).toBe("class-1 class-2 class-3 class-4");
    });

    describe("when there are nil values", () => {
      it("should ignore the nil values", () => {
        const input = [
          ["class-1", null],
          [undefined, "class-3"],
        ];
        expect(mergeClassNames(input)).toBe("class-1 class-3");
      });
    });
  });

  describe("when input is an array of objects", () => {
    it("should return the merged class names object", () => {
      const input = [
        { "class-1": true },
        { "class-2": true },
        { "class-1": false, "class-3": true },
      ];
      expect(mergeClassNames(input)).toBe("class-2 class-3");
    });
  });

  describe("when input is a mixture", () => {
    it("should return the merged class names object", () => {
      const input = [
        "class-1 class-6",
        null,
        undefined,
        ["class-2", "class-3", null, undefined],
        { "class-4": true, "class-2": false },
        "class-5",
      ];
      expect(mergeClassNames(input)).toBe(
        "class-1 class-3 class-4 class-5 class-6",
      );
    });
  });
});
