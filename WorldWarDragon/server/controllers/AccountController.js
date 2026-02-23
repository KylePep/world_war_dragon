const { Auth0Provider } = await import("../utils/auth0provider/index.js")
import { accountService } from "../services/AccountService.js"
import BaseController from '../utils/BaseController.js'

export class AccountController extends BaseController {
  constructor() {
    super('account')
    this.router

      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('', this.getUserAccount)
      .put('', this.updateAccount)
  }

  async getUserAccount(req, res, next) {
    try {
      const account = await accountService.getAccount(req.userInfo)
      res.send(account)
    } catch (error) {
      next(error)
    }
  }
  async updateAccount(req, res, next) {
    try {
      const accountData = req.body
      const accountInfo = req.userInfo
      const account = await accountService.updateAccount(accountInfo, accountData)
      return res.send(account)
    } catch (error) {
      next(error)
    }
  }
}
