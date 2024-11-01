import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
    ) {}

    async createOrFindCustomer(first_name: string, last_name: string, date_of_birth: Date) {
        let customer = await this.customerRepository.findOne({
            where: { first_name, last_name, date_of_birth },
        });

        if (customer) {
            return { id: customer.id, isCreated: false };
        }

        customer = this.customerRepository.create({ first_name, last_name, date_of_birth });
        await this.customerRepository.save(customer);
        return { id: customer.id, isCreated: true };
    }
}
