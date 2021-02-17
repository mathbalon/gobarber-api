import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

import ListProvidersService from './ListProvidersService'

let fakeUsersRepository: FakeUsersRepository
let fakeCacheProvider: FakeCacheProvider
let listProvider: ListProvidersService

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeCacheProvider = new FakeCacheProvider()

    listProvider = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    )
  })

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Fulano Silva',
      email: 'fulano@gmail.com',
      password: '123456',
    })

    const user2 = await fakeUsersRepository.create({
      name: 'Cicrano Santos',
      email: 'cicrano@gmail.com',
      password: '232321',
    })

    const user3 = await fakeUsersRepository.create({
      name: 'Beltrano Souza',
      email: 'beltrano@gmail.com',
      password: 'qwerty',
    })

    const loggedUser = await fakeUsersRepository.create({
      name: 'Matheus Balonecker',
      email: 'mathbalonn@gmail.com',
      password: 'asdasd',
    })

    const providers = await listProvider.execute({
      user_id: loggedUser.id,
    })

    expect(providers).toEqual([user1, user2, user3])
  })
})
