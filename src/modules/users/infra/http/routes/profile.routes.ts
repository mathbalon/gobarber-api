import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'

import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import ProfileController from '../controllers/ProfileController'

const profileRouter = Router()
const profileControle = new ProfileController()

profileRouter.use(ensureAuthenticated)

profileRouter.get('/', profileControle.show)

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.when('old_password', {
        is: Joi.exist(),
        then: Joi.required(),
      }),
      password_confirmation: Joi.when('password', {
        is: Joi.exist(),
        then: Joi.valid(Joi.ref('password')).required(),
      }),
    },
  }),
  profileControle.update,
)

export default profileRouter
