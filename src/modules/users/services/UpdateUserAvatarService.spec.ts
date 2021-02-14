import AppError from '@shared/errors/AppError'

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageAvatar'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import UpdateUserAvatarService from './UpdateUserAvatarService'

let fakeUsersRepository: FakeUsersRepository
let fakeStorageProvider: FakeStorageProvider
let updateUserAvatar: UpdateUserAvatarService

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeStorageProvider = new FakeStorageProvider()

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    )
  })

  it('should be able to update user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fulano',
      email: 'fulano@gmail.com',
      password: '123456',
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    })

    expect(user.avatar).toBe('avatar.jpg')
  })

  it('should not be able to update user avatar from non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing',
        avatarFileName: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile')

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    )

    const user = await fakeUsersRepository.create({
      name: 'Fulano',
      email: 'fulano@gmail.com',
      password: '123456',
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar_old.jpg',
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar_new.jpg',
    })

    expect(deleteFile).toHaveBeenCalledWith('avatar_old.jpg')
    expect(user.avatar).toBe('avatar_new.jpg')
  })
})
