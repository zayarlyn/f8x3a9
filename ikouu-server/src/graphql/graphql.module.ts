import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Global, Module } from '@nestjs/common';
import { GraphQLModule, ID, Query, Resolver } from '@nestjs/graphql';

import { Field, ObjectType } from '@nestjs/graphql';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { TodoListModel, TripModel } from 'src/db/db.module';

@ObjectType()
export class BaseType {
  @Field(() => ID, { name: 'id' })
  _id: number;

  @Field({})
  createdAt: Date;

  @Field({})
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt: Date;
}

@ObjectType()
export class TodoList extends BaseType {
  @Field({})
  name: string;

  // @Field({})
  // status: string;
}

@ObjectType()
export class Trip extends BaseType {
  @Field({})
  name: string;

  @Field({})
  status: string;

  @Field(() => [TodoList])
  todoLists: TodoList[];
}

@Resolver(() => Trip)
export class TripListQueryResolver {
  constructor(
    @InjectModel(TripModel.name) private tripModel: Model<TripModel>,
    @InjectModel(TodoListModel.name) private todoListModel: Model<TripModel>,
    @InjectConnection() private connection: Connection,
  ) {}

  @Query(() => [Trip], { name: 'tripList' })
  // async author(@Args('id', { type: () => Int }) id: number) {
  async resolver() {
    const trips = this.tripModel.find({ deletedAt: null }).populate({
      path: 'todoLists',
      match: { deletedAt: null }, // Only fetch non-deleted todoLists
    });

    return trips;
  }
}

@Global()
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      autoSchemaFile: true,
    }),
  ],
  providers: [TripListQueryResolver],
})
export class MyGraphQLModule {}
