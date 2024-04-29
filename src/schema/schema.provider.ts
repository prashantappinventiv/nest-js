import { Connection } from 'mongoose';
import { ClientSchema } from './client.schema';
import { ENUM } from 'src/common/enum';

export const schemaProviders = [
  {
    provide: 'CLIENT_MODEL',
    useFactory: (connection: Connection) => connection.model(ENUM.COLLECTIONS.CLIENT, ClientSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
