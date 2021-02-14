import { Router } from 'express'

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import AppointmentsController from '../controllers/AppointmentsController'
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController'

const appointementsRouter = Router()

const appointmentsController = new AppointmentsController()
const providerAppointmentsController = new ProviderAppointmentsController()

appointementsRouter.use(ensureAuthenticated)

appointementsRouter.post('/', appointmentsController.create)

appointementsRouter.get(
  '/provider-schedule',
  providerAppointmentsController.index,
)

export default appointementsRouter
