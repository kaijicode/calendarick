import { chunk, getCalendar, getDaysInMonth, groupByWeeks, take } from './calendar';

describe('getDaysInMonth', () => {
  test('should return 31 for January 2019', () => {
    expect(getDaysInMonth(2019, 1)).toBe(31);
  });

  test('should work with leap years', () => {
    expect(getDaysInMonth(2020, 2)).toBe(29);
  });
});

describe('getCalendar', () => {
  test('should return calendar', () => {
    const december = getCalendar(2019, 12);
    const [firstDay, lastDay] = [december[0], december[december.length-1]];

    expect(firstDay.weekDay).toBe('Sun');
    expect(firstDay.dayOfMonth).toBe(1);

    expect(lastDay.weekDay).toBe('Tue');
    expect(lastDay.dayOfMonth).toBe(31);
  });

  test('should not return outside days when withOutsideDays is false (default)', () => {
    const july = getCalendar(2019, 7);
    const [firstDay, lastDay] = [july[0], july[july.length-1]];

    expect(firstDay.month).toBe(7);
    expect(firstDay.dayOfMonth).toBe(1);
    expect(firstDay.weekDay).toBe('Mon');

    expect(lastDay.month).toBe(7);
    expect(lastDay.dayOfMonth).toBe(31);
    expect(lastDay.weekDay).toBe('Wed');
  });

  test('should return outside days of current month when withOutsideDays=true', () => {
    const calendar = getCalendar(2019, 7, {withOutsideDays: true});
    const [firstDay, lastDay] = [calendar[0], calendar[calendar.length-1]];

    expect(firstDay.month).toBe(6);
    expect(firstDay.dayOfMonth).toBe(30);
    expect(firstDay.weekDay).toBe('Sun');

    expect(lastDay.month).toBe(8);
    expect(lastDay.dayOfMonth).toBe(3);
    expect(lastDay.weekDay).toBe('Sat');
  });

  test('should return outside days for December calendar', () => {
    const calendar = getCalendar(2019, 12, {withOutsideDays: true});
    const [firstDay, lastDay] = [calendar[0], calendar[calendar.length-1]];

    expect(firstDay.weekDay).toBe('Sun');
    expect(firstDay.dayOfMonth).toBe(1);
    expect(firstDay.month).toBe(12);

    expect(lastDay.weekDay).toBe('Sat');
    expect(lastDay.dayOfMonth).toBe(4);
    expect(lastDay.month).toBe(1);
    expect(lastDay.year).toBe(2020);
  });

  test('should return outside days for January calendar', () => {
    const calendar = getCalendar(2020, 1, {withOutsideDays: true});
    const [firstDay, lastDay] = [calendar[0], calendar[calendar.length-1]];

    expect(firstDay.weekDay).toBe('Sun');
    expect(firstDay.dayOfMonth).toBe(29);
    expect(firstDay.month).toBe(12);
    expect(firstDay.year).toBe(2019);

    expect(lastDay.weekDay).toBe('Sat');
    expect(lastDay.dayOfMonth).toBe(1);
    expect(lastDay.month).toBe(2);
    expect(lastDay.year).toBe(2020);
  });

});

describe('take', () => {
  test('take of 0', () => {
    function* days() { yield 1; yield 2; yield 3; yield 4 }

    const values = take(0, days);
    expect(values.length).toEqual(0);
  });

  test('should take 3 values', () => {
    function* days() { yield 1; yield 2; yield 3; yield 4 }

    const values = take(3, days);
    expect(values.length).toBe(3);
    expect(values[0]).toBe(1);
    expect(values[1]).toBe(2);
    expect(values[2]).toBe(3);
  });
});

describe('chunk', () => {
  test('should return array in chunks', () => {
    const array = [1, 2, 3, 4, 5];
    const chunks = chunk(array, 3);

    expect(chunks.length).toBe(2);
    expect(chunks).toEqual([ [1, 2, 3], [4, 5]]);
  });
});

describe.only('groupByWeeks', () => {
  test('should group days into weeks', () => {
    // TODO: wrong. it should group by weeks. if `withOutsideDays` false then week can have 7 or less days in it.
    const october = getCalendar(2019, 10);
    const grouped = groupByWeeks(october);

    const [firstWeek, lastWeek] = [grouped[0], grouped[grouped.length-1]];

    expect(grouped.length).toBe(5);

    expect(firstWeek.length).toBe(5);
    expect(firstWeek[0].weekDay).toBe('Tue');
    expect(firstWeek[0].dayOfMonth).toBe(1);

    expect(lastWeek.length).toBe(5);
    expect(lastWeek[lastWeek.length-1].weekDay).toBe('Thu');
    expect(lastWeek[lastWeek.length-1].dayOfMonth).toBe(31);
  });

  test('should work with outsideDays', () => {
    const october = getCalendar(2019, 10, {withOutsideDays: true});
    const grouped = groupByWeeks(october);

    const [firstWeek, lastWeek] = [grouped[0], grouped[grouped.length-1]];

    expect(grouped.length).toBe(5);

    expect(firstWeek.length).toBe(7);
    expect(firstWeek[0].weekDay).toBe('Sun');
    expect(firstWeek[0].dayOfMonth).toBe(29);
    expect(firstWeek[0].month).toBe(9);

    expect(lastWeek.length).toBe(7);
    expect(lastWeek[lastWeek.length-1].weekDay).toBe('Sat');
    expect(lastWeek[lastWeek.length-1].dayOfMonth).toBe(2);
    expect(lastWeek[lastWeek.length-1].month).toBe(11);
  });
});
