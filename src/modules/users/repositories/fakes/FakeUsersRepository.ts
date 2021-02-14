import { v4 } from 'uuid'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'

import User from '@modules/users/infra/typeorm/entities/User'
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO'

export default class FakeUsersRepository implements IUsersRepository {
  private users: User[] = []

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id)

    return findUser
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email)

    return findUser
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let { users } = this

    if (except_user_id) {
      users = this.users.filter(user => user.id !== except_user_id)
    }

    return users
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = new User()

    Object.assign(user, { id: v4() }, data)

    this.users.push(user)

    return user
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(u => u.id === user.id)

    this.users[findIndex] = user

    return user
  }
}