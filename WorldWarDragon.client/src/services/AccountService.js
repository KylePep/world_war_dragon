import { router } from "../router.js"
import { AppState } from '../AppState'
import { Account } from '../models/Account.js'
import { logger } from '../utils/Logger'
import { api } from './AxiosService'

class AccountService {
  async getAccount() {
    try {
      const res = await api.get('/account')
      logger.log('account', res.data)
      AppState.account = new Account(res.data)
    } catch (err) {
      logger.error('HAVE YOU STARTED YOUR SERVER YET???', err)
    }




    if (!AppState.account.newAccount || AppState.account.newAccount == 'true') {

      AppState.account.name = 'Recruit'

      AppState.account.healAid += 1;

      AppState.account.picture = `/assets/player/player0.jpeg`

      AppState.account.newAccount = 'false'

      router.push({ name: "Tutorial" })

      this.editAccount(AppState.account)

    } else {

      if (AppState.account.picture.length < 2) {
        AppState.account.picture = `/assets/player/player${AppState.account.picture}.jpeg`
      }
    }

  }

  async editAccount(accountData) {
    const res = await api.put(`/account`, accountData)
    logger.log('account', res.data)
    const account = new Account(res.data)
    AppState.account = account
    if (account.picture.length < 2) {
      AppState.account.picture = `/assets/player/player${account.picture}.jpeg`
    }
  }
}

export const accountService = new AccountService()
