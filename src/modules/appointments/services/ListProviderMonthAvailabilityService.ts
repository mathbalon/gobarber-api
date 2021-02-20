import { injectable, inject } from 'tsyringe'
import { endOfDay, getDate, getDaysInMonth, isAfter } from 'date-fns'
import IAppointmentRepository from '../repositories/IAppointmentRepository'

interface IRequest {
  provider_id: string
  month: number
  year: number
}

type IResponse = Array<{
  day: number
  available: boolean
}>

@injectable()
export default class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      { provider_id, year, month },
    )

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1))

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    )

    const availability = eachDayArray.map(day => {
      const compareDate = endOfDay(new Date(year, month - 1, day))

      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day
      })

      return {
        day,
        available:
          isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
      }
    })

    return availability
  }
}
