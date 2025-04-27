import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TripDocument = HydratedDocument<TripModel>;

enum ETripStatus {
  draft = 'draft',
  started = 'started',
  ended = 'ended',
}

@Schema()
export class BaseModel {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: string;

  @Prop({ type: Date })
  createdAt: string;

  @Prop({ type: Date })
  updatedAt: string;

  @Prop({ type: Date, default: null })
  deletedAt?: string;
}

@Schema({
  collection: 'todoList',
})
export class TodoListModel extends BaseModel {
  @Prop()
  name: string;

  // @Prop({ type: Types.ObjectId })
  // tripId: string;
  @Prop({ type: Types.ObjectId, ref: () => 'TripModel' })
  tripId: string | TripModel;
}

@Schema({
  collection: 'trip',
})
export class TripModel extends BaseModel {
  @Prop({ type: String })
  description: string;

  @Prop({ type: Date })
  startDate: string;

  @Prop({ type: Date })
  endDate: string;

  @Prop({ enum: ETripStatus, default: ETripStatus.draft })
  status: ETripStatus;

  @Prop()
  name: string;
}

export const TripSchema = SchemaFactory.createForClass(TripModel);
export const TodoListSchema = SchemaFactory.createForClass(TodoListModel);

TripSchema.virtual('todoLists', {
  ref: TodoListModel.name, // name of the related model
  localField: '_id', // field in Trip
  foreignField: 'tripId', // field in TodoList that references Trip
  options: {},
});

// TripSchema.virtual('todoLists', {
//   ref: 'TodoListModel',
//   localField: '_id',
//   foreignField: 'tripId',
//   justOne: false, // Set to false for an array of results
// });

@Global()
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/sisu'),
    MongooseModule.forFeature([
      { name: TripModel.name, schema: TripSchema },
      { name: TodoListModel.name, schema: TodoListSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DbModule {}
