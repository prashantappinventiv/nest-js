import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found');
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found');
    }

    return document;
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filterQuery).lean<TDocument[]>(true);
  }

  saveDataInBackground(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model
        .create(data)
        .then((data: any) => {
          resolve(data);
        })
        .catch((err: any) => {
         reject(err);
        });
    });
  }

  async saveData(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model
        .create(data)
        .then((data: any) => {
          resolve(data);
        })
        .catch((err: any) => {
          console.error(err);
         reject(err);
        });
    });
  }

  async getDataById(query: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model
        .findById(query)
        .then((data: any) => {
          resolve(data);
        })
        .catch((err: any) => {
         reject(err);
        });
    });
  }



  async updateOne(conditions: any, update: any, options: any = { lean: true }): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model
        .updateOne(conditions, update, options)
        .then((data: any) => {
          resolve(data);
        })
        .catch((err: any) => {
         reject(err);
        });
    });
  }

  async updateMany(conditions: any, update: any, options: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      if (options != undefined) {
        options['writeConcern'] = { w: 'majority', wtimeout: 5000 };
      } else {
        options = { writeConcern: { w: 'majority', wtimeout: 5000 } };
      }
      this.model
        .updateMany(conditions, update, options)
        .then((data: any) => {
          resolve(data);
        })
        .catch((err: any) => {
         reject(err);
        });
    });
  }

  async findAll(query: any, projection: any = {}, options: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model
        .find(query, projection, options)
        .lean()
        .then((data: any) => {
          resolve(data);
        })
        .catch((err: any) => {
         //reject(err);
        });
    });
  }

  async findWithPagination(query: any, projection: any = {}, options: any = {}, page = 0, limit = 10): Promise<any> {
    return new Promise((resolve, reject) => {
      const paginationResult: any = { next: false, page: page };
      this.model
        .find(query, projection, options)
        .skip((page - 1) * limit)
        .limit(limit + 1)
        .then((data: any) => {
          resolve(data);
          if (data.length) {
            if (data.length > limit) {
              paginationResult.next = true;
              data.slice(0, data.length - 1);
            } else paginationResult.result = data;
            resolve(paginationResult);
          } else resolve({ next: false, result: [], page: page });
        })
        .catch((err: any) => {
         reject(err);
        });
    });
  }

  async findAllPaginated(query: any, projection: any = {}, options: any = {}, page = 0, size = 10): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model
        .find(query, projection, options)
        .skip(page * size)
        .limit(size)
        .then((data: any) => {
          resolve(data);
        })
        .catch((err: any) => {
         reject(err);
        });
    });
  }

  async insertMany(data: any, options: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model
        .insertMany(data, options)
        .then((data: any) => {
          resolve(data);
        })
        .catch((err: any) => {
         reject(err);
        });
    });
  }

  async distinct(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model
        .distinct(path)
        .then((data: any) => {
          resolve(data);
        })
        .catch((err: any) => {
         reject(err);
        });
    });
  }

  async aggregateData(aggregateArray: any, options: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model
        .aggregate(aggregateArray)
        .then((data: any) => {
          if (options) {
            data.options = options;
          }
          resolve(data);
        })
        .catch((err: any) => {
         reject(err);
        });
    });
  }

  /**
   * @description paginate aggregate
   * @param pipeline
   * @param options.page - current page number
   * @param options.limit - fetch limit for records
   * @param options.getCount - (optional) gets the result with total record count
   * @param options.ranged - (optional) ranged based pagination
   */
  async paginateAggregate(pipeline: any[], options: any = {}) {
    if (options.getCount) {
      pipeline.push({
        $facet: {
          total: [{ $count: 'count' }],
          result: [{ $skip: (options.page - 1) * options.limit }, { $limit: options.limit }],
        },
      });

      let aggregateData: any;
      if (options.hint) {
        aggregateData = await this.model.aggregate(pipeline, { allowDiskUse: true }).collation({ locale: 'en', strength: 1 }).hint(options.hint).exec();
      } else aggregateData = await this.model.aggregate(pipeline, { allowDiskUse: true }).collation({ locale: 'en', strength: 1 }).exec();
      if (aggregateData.length) {
        if (aggregateData[0].result.length) {
          const paginationResult: any = { next: false, page: options.page, total: aggregateData[0].total[0].count };
          if (options.limit * options.page < paginationResult.total) {
            paginationResult.next = true;
          }
          paginationResult.result = aggregateData[0].result;
          return paginationResult;
        } else return { next: false, result: [], page: options.page, total: aggregateData[0].total.length ? aggregateData[0].total[0].count : 0 };
      } else throw new Error('Error in paginate aggregation pipeline');
    } else {
      if (!options.prePaginated) {
        if (options.range) pipeline.push({ $match: options.range });
        else pipeline.push({ $skip: (options.page - 1) * options.limit });
        pipeline.push({ $limit: options.limit + 1 });
      }

      let aggregateData: any;
      if (options.hint) {
        aggregateData = await this.model.aggregate(pipeline, { allowDiskUse: true }).collation({ locale: 'en', strength: 1 }).hint(options.hint).exec();
      } else aggregateData = await this.model.aggregate(pipeline, { allowDiskUse: true }).collation({ locale: 'en', strength: 1 }).exec();
      if (aggregateData.length) {
        const paginationResult: any = { next: false, page: options.page };
        if (aggregateData.length > options.limit) {
          paginationResult.next = true;
          paginationResult.result = aggregateData.slice(0, aggregateData.length - 1);
        } else paginationResult.result = aggregateData;
        return paginationResult;
      } else return { next: false, result: [], page: options.page };
    }
  }

  async deleteMany(query: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model
        .deleteMany(query)
        .then((data: any) => {
          resolve(data);
        })
        .catch((err: any) => {
         //reject(err);
        });
    });
  }

  async aggregate(query: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model
        .aggregate(query)
        .then((data: any) => {
          resolve(data);
        })
        .catch((err: any) => {
         //reject(err);
        });
    });
  }

  async findAllCursor(query: any): Promise<any> {
    return new Promise((resolve, reject) => {
    return this.model.find(query).lean().cursor();
    // .then((data: any) => {
    //   resolve(data);
    // })
    // .catch((err: any) => {
    //  //reject(err);
    // });
    });
  }

  async aggregateCursor(query: any, batchSize: number): Promise<any> {
    // return new Promise((resolve, reject) => {
    return await this.model.aggregate(query).cursor({ batchSize: batchSize });
    // .then((data: any) => {
    //   resolve(data);
    // })
    // .catch((err: any) => {
    //  //reject(err);
    // });
    // });
  }

}
