import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import Hash from '@ioc:Adonis/Core/Hash'
import {rules, schema} from "@ioc:Adonis/Core/Validator";

export default class AuthController {
  public async login({auth,request, response}: HttpContextContract){
    const loginSchema = schema.create({
      email: schema.string([
        rules.email(),
        rules.required(),
      ]),
      password: schema.string([
        rules.required(),
      ]),
    })

    try {
      const payload = await request.validate({
        schema: loginSchema
      })

      // Lookup user manually
      const user = await User
        .query()
        .where('email', payload.email)
        .firstOrFail()

      // Verify password
      if (!(await Hash.verify(user.password,payload.password))) {
        return response.unauthorized('Invalid credentials')
      }

      // Generate token
      const token = await auth.use('api').generate(user)

      return response.status(201).send({
        code: '201',
        message: 'Berhasil login',
        status: 'success',
        result: token
      });
    } catch (error) {
      return response.badRequest({
        code: '400',
        errors: error.message,
      })
    }
  }

  public async register({request,response}: HttpContextContract){
    const registerSchema = schema.create({
      email: schema.string([
        rules.email(),
        rules.required(),
        rules.unique({ table: 'users', column: 'email' })
      ]),
      password: schema.string([
        rules.required(),
        rules.minLength(8)
      ]),
    })

    try {
      const payload = await request.validate({
        schema: registerSchema
      })

      const email = payload.email
      const password = payload.password

      const user = new User();

      user.email = email
      user.password = password

      const userResponse = await user.save()

      return response.status(201).send(
        {
          code: '201',
          message: 'Berhasil melakukan pendaftaran akun',
          status: 'success',
          result: userResponse
        }
      );
    } catch (error) {
      return response.badRequest({
        code: '400',
        errors: error.messages
      })
    }

  }
}
