import {Test, TestingModule} from '@nestjs/testing';
import {CustomerService} from './customer.service';
import {Repository} from 'typeorm';
import {Customer} from './customer.entity';
import {getRepositoryToken} from '@nestjs/typeorm';

describe('CustomerService', () => {
    let service: CustomerService;
    let repository: Repository<Customer>;

    // моковые данные для существующего и нового клиента
    const mockCustomer = { id: 1, first_name: 'John', last_name: 'Doe', date_of_birth: '1990-01-01' };
    const firstName = 'John';
    const lastName = 'Doe';
    const dateOfBirth = '1990-01-01';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CustomerService,
                {
                    provide: getRepositoryToken(Customer),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<CustomerService>(CustomerService);
        repository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
    });

    it('should return existing customer with isCreated: false if customer already exists', async () => {
        // мокаем вызов findOne для поиска существующего клиента
        jest.spyOn(repository, 'findOne').mockResolvedValue(mockCustomer as Customer);

        const result = await service.createOrFindCustomer(firstName, lastName, dateOfBirth);

        expect(result).toEqual({ id: mockCustomer.id, isCreated: false });
        expect(repository.findOne).toHaveBeenCalledWith({
            where: { first_name: firstName, last_name: lastName, date_of_birth: dateOfBirth },
        });
    });

    it('should create and return a new customer with isCreated: true if customer does not exist', async () => {
        // мокаем вызов findOne для отсутствующего клиента
        jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

        // Мокаем create и save для создания нового клиента
        jest.spyOn(repository, 'create').mockReturnValue(mockCustomer as Customer);
        jest.spyOn(repository, 'save').mockResolvedValue(mockCustomer as Customer);

        const result = await service.createOrFindCustomer(firstName, lastName, dateOfBirth);

        expect(result).toEqual({ id: mockCustomer.id, isCreated: true });
        expect(repository.create).toHaveBeenCalledWith({
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
        });
        expect(repository.save).toHaveBeenCalledWith(mockCustomer);
    });

    it('should correctly format the YYYY-MM-DD date with prettifyDate', () => {
        const formattedDate = service['prettifyDate']('1990-01-01');
        expect(formattedDate).toBe('1990-01-01');
    });

    it('should correctly format the YYYY-MM date with prettifyDate', () => {
        const formattedDate = service['prettifyDate']('1990-01');
        expect(formattedDate).toBe('1990-01-01');
    });

    it('should correctly format the YYYY date with prettifyDate', () => {
        const formattedDate = service['prettifyDate']('1990');
        expect(formattedDate).toBe('1990-01-01');
    });
});