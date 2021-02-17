import AppError from '@shared/errors/AppError'

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'
import CreateAppointmentService from './CreateAppointmentService'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let fakeNotificationsRepository: FakeNotificationsRepository
let fakeCacheProvider: FakeCacheProvider
let createAppointment: CreateAppointmentService

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    fakeNotificationsRepository = new FakeNotificationsRepository()
    fakeCacheProvider = new FakeCacheProvider()

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    )
  })

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime()
    })

    const appointment = await createAppointment.execute({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 5, 10, 14),
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('provider')
  })

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2021, 4, 10, 14)

    await createAppointment.execute({
      provider_id: 'provider',
      user_id: 'user',
      date: appointmentDate,
    })

    await expect(
      createAppointment.execute({
        provider_id: 'provider',
        user_id: 'user',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2020, 5, 10, 11),
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        provider_id: 'user',
        user_id: 'user',
        date: new Date(2020, 5, 10, 13),
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment before 8h and after 18h', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2020, 5, 11, 7),
      }),
    ).rejects.toBeInstanceOf(AppError)

    await expect(
      createAppointment.execute({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2020, 5, 10, 18),
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
