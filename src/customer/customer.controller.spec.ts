import {Test, TestingModule} from '@nestjs/testing';
import {CustomerController} from './customer.controller';
import {CustomerService} from './customer.service';
import {CreateCustomerDto} from './customer.dto';
import {HttpStatus} from '@nestjs/common';
import {Response} from 'express';

describe('CustomerController', () => {
    let controller: CustomerController;
    let customerService: CustomerService;

    const mockCustomerService = {
        createOrFindCustomer: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CustomerController],
            providers: [
                {
                    provide: CustomerService,
                    useValue: mockCustomerService,
                },
            ],
        }).compile();

        controller = module.get<CustomerController>(CustomerController);
        customerService = module.get<CustomerService>(CustomerService);
    });

    it('should create a new customer and return 201 status', async () => {
        const createCustomerDto: CreateCustomerDto = {
            first_name: 'John',
            last_name: 'Doe',
            date_of_birth: '1990-01-01',
        };

        const mockResponse: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // мокаем результат сервиса
        const result = {id: 1, isCreated: true};
        mockCustomerService.createOrFindCustomer.mockResolvedValue(result);

        await controller.createOrFindCustomer(createCustomerDto, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
        expect(mockResponse.json).toHaveBeenCalledWith({id: result.id});
        expect(customerService.createOrFindCustomer).toHaveBeenCalledWith(
            createCustomerDto.first_name,
            createCustomerDto.last_name,
            createCustomerDto.date_of_birth,
        );
    });

    it('should return existing customer and 200 status', async () => {
        const createCustomerDto: CreateCustomerDto = {
            first_name: 'John',
            last_name: 'Doe',
            date_of_birth: '1990-01-01',
        };

        const mockResponse: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // мокаем результат сервиса
        const result = {id: 1, isCreated: false};
        mockCustomerService.createOrFindCustomer.mockResolvedValue(result);

        await controller.createOrFindCustomer(createCustomerDto, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
        expect(mockResponse.json).toHaveBeenCalledWith({id: result.id});
        expect(customerService.createOrFindCustomer).toHaveBeenCalledWith(
            createCustomerDto.first_name,
            createCustomerDto.last_name,
            createCustomerDto.date_of_birth,
        );
    });
});