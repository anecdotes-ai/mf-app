import { createSortCallback } from './sort-callback.function';

interface TestCase<T> {
  testName: string;
  unsorted: T[];
  sortedByAsc: T[];
  sortBy: (x: T) => any;
  selector: (x: T) => any;
}

interface TestObject<T> {
  someField: T;
}

describe('createSortCallback', () => {
  function getObjectNumberArrayTestCase(): TestCase<TestObject<number>> {
    return {
      testName: 'objects with number with sortBy',
      sortBy: (x) => x.someField,
      selector: (x) => x.someField,
      unsorted: [{ someField: -200 }, { someField: 10 }, { someField: 3 }, { someField: 2000 }, { someField: 4 }],
      sortedByAsc: [{ someField: -200 }, { someField: 3 }, { someField: 4 }, { someField: 10 }, { someField: 2000 }],
    };
  }

  function getObjectStringArrayTestCase(): TestCase<TestObject<string>> {
    return {
      testName: 'objects with strings with specified sortBy with sortBy',
      sortBy: (x) => x.someField,
      selector: (x) => x.someField,
      unsorted: [
        { someField: 'zzz' },
        { someField: 'bbbb' },
        { someField: 'xxxx' },
        { someField: 'XXXX' },
        { someField: 'mmm' },
        { someField: 'aaa' },
      ],
      sortedByAsc: [
        { someField: 'XXXX' },
        { someField: 'aaa' },
        { someField: 'bbbb' },
        { someField: 'mmm' },
        { someField: 'xxxx' },
        { someField: 'zzz' },
      ],
    };
  }

  function getPrimitiveNumberTestCase(): TestCase<number> {
    return {
      testName: 'primitive numbers with sortBy',
      sortBy: (x) => x,
      selector: (x) => x,
      unsorted: [8, 200, 6, -2, 3, 69],
      sortedByAsc: [-2, 3, 6, 8, 69, 200],
    };
  }

  function getPrimitiveStringTestCase(): TestCase<string> {
    return {
      testName: 'primitive strings with sortBy',
      sortBy: (x) => x,
      selector: (x) => x,
      unsorted: ['mm', 'xx', 'aa', 'ZZZ', 'yy'],
      sortedByAsc: ['ZZZ', 'aa', 'mm', 'xx', 'yy'],
    };
  }

  function getPrimitiveNumberWithoutSortByTestCase(): TestCase<number> {
    return {
      ...getPrimitiveNumberTestCase(),
      testName: 'primitive numbers without sortBy',
      sortBy: undefined,
    };
  }

  function getPrimitiveStringWithoutSortByTestCase(): TestCase<string> {
    return {
      ...getPrimitiveStringTestCase(),
      testName: 'primitive strings without sortBy',
      sortBy: undefined,
    };
  }

  [
    getObjectNumberArrayTestCase(),
    getObjectStringArrayTestCase(),
    getPrimitiveNumberTestCase(),
    getPrimitiveStringTestCase(),
    getPrimitiveNumberWithoutSortByTestCase(),
    getPrimitiveStringWithoutSortByTestCase(),
  ].forEach((testCase) => {
    describe(testCase.testName, () => {
      it('should sort by ASC if sort direction is not specified', () => {
        // Arrange
        // Act
        const sorted = (testCase.unsorted as any[]).sort(createSortCallback(testCase.selector as any));

        // Assert
        expect(sorted.map(testCase.selector)).toEqual((testCase.sortedByAsc as any[]).map(testCase.selector));
      });

      it('should sort by ASC if sort direction is ASC', () => {
        // Arrange
        // Act
        const sorted = (testCase.unsorted as any[]).sort(createSortCallback(testCase.selector as any, 'ASC'));

        // Assert
        expect(sorted.map(testCase.selector)).toEqual((testCase.sortedByAsc as any[]).map(testCase.selector));
      });

      it('should sort by DSC if sort direction is DSC', () => {
        // Arrange
        // Act
        const sorted = (testCase.unsorted as any[]).sort(createSortCallback(testCase.selector as any, 'DSC'));

        // Assert
        expect(sorted.map(testCase.selector)).toEqual((testCase.sortedByAsc as any[]).reverse().map(testCase.selector));
      });
    });
  });
});
