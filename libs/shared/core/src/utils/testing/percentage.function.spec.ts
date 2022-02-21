import { getPrecentsForManyValues, getPercents } from '../percentage.function';

describe('PercentageFunction', () => {
    it('should return "0" if value == 0 and maxValue == 0', () => {
        expect(getPercents()).toBe('0');
    });

    it('should return "0" if maxValue == 0', () => {
        expect(getPercents(4)).toBe('0');
    });

    it('should return "9" if value == 5 maxValue == 55', () => {
        expect(getPercents(5, 55)).toBe('9');
    });

    it('should return [0] if valuesToPercents == [] and any maxValue', () => {
        expect(getPrecentsForManyValues([], 1234)).toEqual([0]);
    });

    it('should return [100] if valuesToPercents == 25 and maxValue == 25', () => {
        expect(getPrecentsForManyValues([25], 25)).toEqual([100]);
    });

    it('should return [4] if valuesToPercents == 25 and maxValue == 625', () => {
        expect(getPrecentsForManyValues([25], 625)).toEqual([4]);
    });

    it('should return [28, 33, 39] if valuesToPercents == [13, 15, 18] and maxValue == 46', () => {
        expect(getPrecentsForManyValues([13, 15, 18], 46)).toEqual([28, 33, 39]);
    });

    it('should return [13, 15, 18] if valuesToPercents == [13, 15, 18] and maxValue == 100', () => {
        expect(getPrecentsForManyValues([13, 15, 18], 100)).toEqual([13, 15, 18]);
    });
});
