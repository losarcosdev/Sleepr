/* eslint-disable prettier/prettier */
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

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
    const document = await this.model.findOne(filterQuery, {}, { lean: true });

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document as TDocument;
  }

  async updateOne(
    filter: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = (await this.model.findOneAndUpdate(filter, update, {
      lean: true,
      new: true,
    })) as TDocument;

    if (!document) {
      this.logger.warn(
        `Document not found with filter ${JSON.stringify(filter)}`,
      );
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async find(filter: FilterQuery<TDocument>): Promise<TDocument[]> {
    const documents = (await this.model.find(
      filter,
      {},
      { lean: true },
    )) as TDocument[];

    return documents;
  }

  async deleteOne(filter: FilterQuery<TDocument>): Promise<TDocument> {
    const document = (await this.model.findOneAndDelete(filter, {
      lean: true,
    })) as TDocument;

    if (!document) {
      this.logger.warn(
        `Document not found with filter ${JSON.stringify(filter)}`,
      );
      throw new NotFoundException('Document not found.');
    }

    return document;
  }
}
