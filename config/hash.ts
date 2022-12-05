/**
 * Config source: https://git.io/JfefW
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import { hashConfig } from '@adonisjs/core/build/config'

/*
|--------------------------------------------------------------------------
| Hash Config
|--------------------------------------------------------------------------
|
| The `HashConfig` relies on the `HashList` interface which is
| defined inside `contracts` directory.
|
*/
export default hashConfig({
  /*
  |--------------------------------------------------------------------------
  | Default hasher
  |--------------------------------------------------------------------------
  |
  | By default we make use of the argon hasher to hash values. However, feel
  | free to change the default value
  |
  */
  default: Env.get('HASH_DRIVER', 'bcrypt'),
  list: {
    bcrypt: {
      driver: 'bcrypt',
      rounds: 10,
    },
  },
})
