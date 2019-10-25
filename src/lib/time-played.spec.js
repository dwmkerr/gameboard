import timePlayed from './time-played';

describe('timePlayed', () => {
  test('should throw if an invalid type is passed', () => {
    expect(() => timePlayed('sometime')).toThrow(/Date/);
  });

  //  TODO: Currently skipping this as I cannot get the mocking to work correctly.
  xtest('should render anything today as the time only', () => {
    //  Mock the 'now' time, check 10 today is 10am.
    // jest.spyOn(Date, 'now').mockReturnValueOnce(new Date('2019–01–10T12:00:00+00:00'));
    expect(timePlayed(new Date('2019–01–10T10:00:00+00:00'))).toEqual('10:00am');
  });
});
