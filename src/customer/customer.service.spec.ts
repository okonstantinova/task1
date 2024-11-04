import {Test, TestingModule} from '@nestjs/testing';
import {CustomerService} from './customer.service';
import {getRepositoryToken} from '@nestjs/typeorm';
import {QueryFailedError, Repository} from 'typeorm';
import {Customer} from './customer.entity';

describe('CustomerService', () => {
    let service: CustomerService;
    let repository: Repository<Customer>;

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

    it('should create a new customer if not exists', async () => {
        const firstName = 'John';
        const lastName = 'Doe';
        const dateOfBirth = '1990-01-01';

        const customer = {first_name: firstName, last_name: lastName, date_of_birth: dateOfBirth};
        const savedCustomer = {...customer, id: 1};

        jest.spyOn(repository, 'create').mockReturnValue(customer as Customer);
        jest.spyOn(repository, 'save').mockResolvedValue(savedCustomer as Customer);
        jest.spyOn(repository, 'findOne').mockResolvedValue(null);

        const result = await service.createOrFindCustomer(firstName, lastName, dateOfBirth);
        expect(result).toEqual({id: savedCustomer.id, isCreated: true});
        expect(repository.save).toHaveBeenCalledWith(customer as Customer);
        expect(repository.findOne).toHaveBeenCalledTimes(0);
    });

    it('should find an existing customer if unique constraint is violated', async () => {
        const firstName = 'John';
        const lastName = 'Doe';
        const dateOfBirth = '1990-01-01';

        const customer = {first_name: firstName, last_name: lastName, date_of_birth: dateOfBirth};
        const existingCustomer = {...customer, id: 2};
        const violationError = new QueryFailedError('', [], {code: '23505'} as any);

        jest.spyOn(repository, 'create').mockReturnValue(customer as Customer);
        jest.spyOn(repository, 'save').mockRejectedValue(violationError);
        jest.spyOn(repository, 'findOne').mockResolvedValue(existingCustomer as Customer);

        const result = await service.createOrFindCustomer(firstName, lastName, dateOfBirth);
        expect(result).toEqual({id: existingCustomer.id, isCreated: false});
    });

    it('should throw an error if finding existing customer fails after unique constraint violation', async () => {
        const firstName = 'John';
        const lastName = 'Doe';
        const dateOfBirth = '1990-01-01';

        const customer = {first_name: firstName, last_name: lastName, date_of_birth: dateOfBirth};
        const violationError = new QueryFailedError('', [], {code: '23505'} as any);

        jest.spyOn(repository, 'create').mockReturnValue(customer as Customer);
        jest.spyOn(repository, 'save').mockRejectedValue(violationError);
        jest.spyOn(repository, 'findOne').mockResolvedValue(null);

        await expect(service.createOrFindCustomer(firstName, lastName, dateOfBirth)).rejects.toThrow(
            'Insertion of new customer and finding existing customer failed',
        );
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

    it('should return true for unique constraint violations passed to isPostgresUniqueConstraintViolation', () => {
        const violationError = new QueryFailedError('', [], {code: '23505'} as any);
        const result = service['isPostgresUniqueConstraintViolation'](violationError);
        expect(result).toBe(true);
    });

    it('should return false for non-unique constraint violations passed to isPostgresUniqueConstraintViolation', () => {
        const violationError = new QueryFailedError('', [], {code: '12345'} as any);
        const result = service['isPostgresUniqueConstraintViolation'](violationError);
        expect(result).toBe(false);
    });
});