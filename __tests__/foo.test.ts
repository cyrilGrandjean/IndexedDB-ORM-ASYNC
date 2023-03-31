import { sum2 } from './foo';

test('basic', () => {
    expect(sum2()).toBe(0);
});

test('basic again', () => {
    expect(sum2(1, 2)).toBe(3);
});
