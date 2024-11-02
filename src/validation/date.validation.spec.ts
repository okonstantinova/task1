import {BirthDateStringValidatorConstraint} from './date.validation';
import {ValidationArguments} from 'class-validator';

describe('BirthDateStringValidatorConstraint', () => {
    let validator: BirthDateStringValidatorConstraint = new BirthDateStringValidatorConstraint();

    it('should return false for non-ISO8601 date strings', () => {
        const invalidDates = ['2024-13-01', '2024-01-32', '01-01-2024', '2024-01-01T00:00:00Z', 'invalid-date'];
        for (const date of invalidDates) {
            expect(validator.validate(date, {} as ValidationArguments)).toBe(false);
        }
    });

    it('should return false for future dates', () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1); // устанавливаем дату на год вперед
        const futureDateString = futureDate.toISOString().split('T')[0]; // получаем строку формата YYYY-MM-DD
        expect(validator.validate(futureDateString, {} as ValidationArguments)).toBe(false);
    });

    it('should return true for valid past dates', () => {
        const validDate = '2020-01-01'; // пример действительной даты
        expect(validator.validate(validDate, {} as ValidationArguments)).toBe(true);
    });

    it('should return true for today\'s date', () => {
        const today = new Date().toISOString().split('T')[0]; // получаем строку формата YYYY-MM-DD для сегодняшней даты
        expect(validator.validate(today, {} as ValidationArguments)).toBe(true);
    });

    it('should return the correct default message', () => {
        const args: ValidationArguments = {property: 'date_of_birth'} as ValidationArguments;
        const message = validator.defaultMessage(args);
        expect(message).toBe('$property must be a valid YYYY-MM-DD date only string');
    });
});