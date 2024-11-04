import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {QueryFailedError, Repository} from 'typeorm';
import {Customer} from './customer.entity';
import {format, parseISO} from "date-fns";

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
    ) {
    }

    async createOrFindCustomer(firstName: string, lastName: string, dateOfBirth: string) {
        dateOfBirth = this.prettifyDate(dateOfBirth);

        let customer = this.customerRepository.create({
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth
        });

        try {
            customer = await this.customerRepository.save(customer);
            return {id: customer.id, isCreated: true};
        } catch (error) {
            if (!this.isPostgresUniqueConstraintViolation(error)) {
                throw error;
            }
        }

        customer = await this.customerRepository.findOne({
            where: {first_name: firstName, last_name: lastName, date_of_birth: dateOfBirth},
        });

        if (!customer) {
            throw new Error('Insertion of new customer and finding existing customer failed');
        }

        return {id: customer.id, isCreated: false};
    }

    private prettifyDate(date: string) {
        return format(parseISO(date), 'yyyy-MM-dd');
    }

    private isPostgresUniqueConstraintViolation(error: any): boolean {
        return error instanceof QueryFailedError && error.driverError.code === '23505';
    }
}
