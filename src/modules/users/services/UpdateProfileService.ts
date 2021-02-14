import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import IUsersRepository from '../repositories/IUsersRepository'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'

import User from '../infra/typeorm/entities/User'

interface IRequest {
  user_id: string
  name: string
  email: string
  old_password?: string
  password?: string
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User does not exist')
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email)

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('Email already in use')
    }

    user.name = name
    user.email = email

    if (password) {
      if (old_password) {
        const checkOldPassword = await this.hashProvider.compareHash(
          old_password,
          user.password,
        )

        if (!checkOldPassword) {
          throw new AppError('Old password does not match')
        }

        user.password = await this.hashProvider.generateHash(password)
      } else {
        throw new AppError('You need to inform the old password to set the new')
      }
    }

    return this.usersRepository.save(user)
  }
}
