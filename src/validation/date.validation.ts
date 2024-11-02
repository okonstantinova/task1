import {
    isISO8601,
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import {isBefore, isEqual, startOfDay} from "date-fns";

@ValidatorConstraint({async: false})
export class BirthDateStringValidatorConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        if (!isISO8601(value, {strict: true, strictSeparator: true})) {
            return false;
        }

        if (value.includes('T')) {
            return false;
        }

        const check = startOfDay(new Date(value));
        const today = startOfDay(new Date());

        return isBefore(check, today) || isEqual(check, today);
    }

    defaultMessage(args: ValidationArguments) {
        return '$property must be a valid YYYY-MM-DD date only string';
    }
}

export function IsBirthDateString(validationOptions?: ValidationOptions) : PropertyDecorator {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: BirthDateStringValidatorConstraint,
        });
    };
}