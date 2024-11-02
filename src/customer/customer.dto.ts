import {IsString, IsNotEmpty, MaxLength} from 'class-validator';
import {IsBirthDateString} from "../validation/date.validation";

export class CreateCustomerDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    first_name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    last_name: string;

    @IsBirthDateString()
    @IsNotEmpty()
    date_of_birth: string;
}