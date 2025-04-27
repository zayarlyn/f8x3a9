import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TripModule } from './modules/trip/trip.module';

import { MyGraphQLModule } from './graphql/graphql.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [DbModule, MyGraphQLModule, TripModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
