import { Router } from 'express'

import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import ProfileController from '../controllers/ProfileController'

const profileRouter = Router()
const profileControle = new ProfileController()

profileRouter.use(ensureAuthenticated)

profileRouter.get('/', profileControle.show)

profileRouter.put('/', profileControle.update)

export default profileRouter
