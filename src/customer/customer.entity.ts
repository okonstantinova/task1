import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 255})
    first_name: string;

    @Column({type: "varchar", length: 255})
    last_name: string;

    @Column({type: 'date'})
    date_of_birth: string;
}
