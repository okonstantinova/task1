import {Controller, Post, Body, HttpStatus, Res, UsePipes, ValidationPipe} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Response } from 'express';
import {CreateCustomerDto} from "./customer.dto";

@Controller('v1/customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Post()
    @UsePipes(new ValidationPipe({transform: true}))
    async createOrFindCustomer(
        @Body() customer: CreateCustomerDto,
        @Res() response: Response,
    ) {
        const result
            = await this.customerService
            .createOrFindCustomer(customer.first_name, customer.last_name, customer.date_of_birth);

        return response.status(result.isCreated ? HttpStatus.CREATED : HttpStatus.OK)
            .json({ id: result.id });
    }
}
