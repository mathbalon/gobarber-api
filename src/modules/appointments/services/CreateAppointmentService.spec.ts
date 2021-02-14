import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'
import AppError from '@shared/errors/AppError'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let createAppointment: CreateAppointmentService

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository)

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime()
    })
  })

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 5, 10, 14),
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('provider')
  })

  it('should not be able to create two appointments on the same time', async () => {
    await createAppointment.execute({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 5, 10, 14),
    })

    await expect(
      createAppointment.execute({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2020, 5, 10, 14),
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment on a past date', async () => {
    await expect(
      createAppointment.execute({
        provider_id: 'user',
        user_id: 'user',
        date: new Date(2020, 5, 10, 11),
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment with same user as provider', async () => {
    await expect(
      createAppointment.execute({
        provider_id: 'user',
        user_id: 'user',
        date: new Date(2020, 5, 10, 13),
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment before 8h and after 18h', async () => {
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
