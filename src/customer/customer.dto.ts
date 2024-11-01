import {IsString, IsNotEmpty, MaxLength, IsDateString} from 'class-validator';

export class CreateCustomerDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    first_name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    last_name: string;

    @IsDateString()
    @IsNotEmpty()
    date_of_birth: Date;
}