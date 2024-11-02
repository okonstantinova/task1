import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
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

        let customer = await this.customerRepository.findOne({
            where: {first_name: firstName, last_name: lastName, date_of_birth: dateOfBirth},
        });

        if (customer) {
            return {id: customer.id, isCreated: false};
        }

        customer = this.customerRepository.create({
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth
        });
        await this.customerRepository.save(customer);
        return {id: customer.id, isCreated: true};
    }

    private prettifyDate(date: string) {
        return format(parseISO(date), 'yyyy-MM-dd');
    }
}
