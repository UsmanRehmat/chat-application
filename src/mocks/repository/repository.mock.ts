import { Repository } from 'typeorm';
import { MockType } from '../types/mock.type';

export const getRepositoryMockFactory: (
  entityClass?: any,
) => () => MockType<Repository<any>> = (entityClass) =>
  jest.fn(() => ({
    findOne: jest.fn((entity) => {
      if (entity.where) return entity.where;
      return entity;
    }),
    findAndCount: jest.fn((entity) => {
      if (entity.where) return entity.where;
      return entity;
    }),
    findOneOrFail: jest.fn((entity) => {
      if (entity.where) return entity.where;
      return entity;
    }),
    save: jest.fn((entity) => entity),
    update: jest.fn((...params) => params),
    delete: jest.fn((entity) => {
      if (entity.where) return entity.where;
      return entity;
    }),
    findByIds: jest.fn((entity) => {
      if (entity.where) return entity.where;
      return entity;
    }),
    count: jest.fn((params) => {
      return params;
    }),
  }));