import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import ShowProfileService from './ShowProfileService'

let fakeUsersRepository: FakeUsersRepository
let showProfile: ShowProfileService

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()

    showProfile = new ShowProfileService(fakeUsersRepository)
  })

  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fulano Silva',
      email: 'fulano@gmail.com',
      password: '123456',
    })

    const profile = await showProfile.execute({
      user_id: user.id,
    })

    expect(profile.name).toBe('Fulano Silva')
    expect(profile.email).toBe('fulano@gmail.com')
  })

  it('should not be able to show the profile from non-existing user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
