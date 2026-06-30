import { ModelCtor } from 'sequelize-typescript'

export const getRepositoryToken = (model: ModelCtor<any>) => {
  return `NESTLIZE_REPOSITORY_${model.name}`
}
