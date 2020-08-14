import { randomInt } from './math.js';

describe('testing math.js', () => {
  describe('testing function randomInt', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('should return a minimal value in range [2, 8)', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      expect(randomInt(2, 8)).toBeCloseTo(2);
    });

    test('should return a maximum value in range [2, 8)', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.99999);
      expect(randomInt(2, 8)).toBeCloseTo(7);
    });

    test('should return a minimal value in range [4, 123)', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      expect(randomInt(4, 123)).toBeCloseTo(4);
    });

    test('should return a maximum value in range [4, 123)', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.99999);
      expect(randomInt(4, 123)).toBeCloseTo(122);
    });
  });
});
