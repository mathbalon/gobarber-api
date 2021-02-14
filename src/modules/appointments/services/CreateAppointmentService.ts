import { format, getHours, isBefore, startOfHour } from 'date-fns'
import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import Appointment from '../infra/typeorm/entities/Appointments'
import IAppointmentRepository from '../repositories/IAppointmentRepository'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'

interface IRequest {
  provider_id: string
  user_id: string
  date: Date
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentRepository')
    private appointmentsRepository: IAppointmentRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequest): Promise<Appointment> {
    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself.")
    }

    const appointmentDate = startOfHour(date)

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past date.")
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'You can only create an appointment between 8am and 6pm',
      )
    }

    const findAppointmentSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    )

    if (findAppointmentSameDate) {
      throw new AppError('This appointment is already booked')
    }

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'")

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}.`,
    })

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    })

    return appointment
  }
}

export default CreateAppointmentService
