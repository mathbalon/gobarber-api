import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokenRepository'
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'

let fakeUsersRepository: FakeUsersRepository
let fakeMailProvider: FakeMailProvider
let fakeUserTokensRepository: FakeUserTokensRepository

let sendForgotPasswordEmail: SendForgotPasswordEmailService

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokensRepository = new FakeUserTokensRepository()
    fakeMailProvider = new FakeMailProvider()

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeMailProvider,
    )
  })

  it('should be able to recovery the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')

    await fakeUsersRepository.create({
      name: 'Fulano',
      email: 'fulano@gmail.com',
      password: '123456',
    })

    await sendForgotPasswordEmail.execute({
      email: 'fulano@gmail.com',
    })

    expect(sendMail).toHaveBeenCalled()
  })

  it('should not be able to recover a no-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'fulano@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate')

    const user = await fakeUsersRepository.create({
      name: 'Fulano',
      email: 'fulano@gmail.com',
      password: '123456',
    })

    await sendForgotPasswordEmail.execute({
      email: 'fulano@gmail.com',
    })

    expect(generateToken).toHaveBeenCalledWith(user.id)
  })
})
