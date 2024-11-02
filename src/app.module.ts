import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config"
import {CustomerModule} from './customer/customer.module';
import databaseConfig from "./database.config";

@Module({
    imports: [
        ConfigModule.forRoot(
            {
                isGlobal: true,
            }
        ),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: databaseConfig,
        }),
        CustomerModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
