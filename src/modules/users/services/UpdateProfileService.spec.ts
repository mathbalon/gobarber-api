import AppError from '@shared/errors/AppError'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import UpdateProfileService from './UpdateProfileService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let updateProfile: UpdateProfileService

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    )
  })

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fulano da Silva',
      email: 'fulano@hotmail.com',
      password: '123456',
    })

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Fulano Silva',
      email: 'fulano@gmail.com',
    })

    expect(updatedUser.name).toBe('Fulano Silva')
    expect(updatedUser.email).toBe('fulano@gmail.com')
  })

  it('should not be able to update profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user',
        name: 'Fulano dos Santos',
        email: 'fulano@hotmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Fulano da Silva',
      email: 'fulano@hotmail.com',
      password: '123456',
    })

    const user = await fakeUsersRepository.create({
      name: 'Fulano dos Santos',
      email: 'fulano_santos@hotmail.com',
      password: 'qwerty',
    })

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Fulano dos Santos',
        email: 'fulano@hotmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fulano da Silva',
      email: 'fulano@hotmail.com',
      password: '123456',
    })

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Fulano Silva',
      email: 'fulano@gmail.com',
      old_password: '123456',
      password: '123123',
    })

    expect(updatedUser.password).toBe('123123')
  })

  it('should not be able to update the password without the old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fulano da Silva',
      email: 'fulano@hotmail.com',
      password: '123456',
    })

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Fulano Silva',
        email: 'fulano@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to update the password without the wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fulano da Silva',
      email: 'fulano@hotmail.com',
      password: '123456',
    })

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Fulano Silva',
        email: 'fulano@gmail.com',
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
