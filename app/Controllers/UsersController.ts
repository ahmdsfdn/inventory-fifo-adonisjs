import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import {rules, schema} from "@ioc:Adonis/Core/Validator";
import {req} from "pino-std-serializers";

export default class UsersController {
  public async index({request, response}: HttpContextContract) {
    const { pageVal } = request.qs();
    const users = await User.all();
    return response.status(200).send({
      code: '200',
      message: 'Data berhasil di ambil',
      status: 'success',
      result: users,
    })
  }

  public async store({request, response}: HttpContextContract) {
    const storeSchema = schema.create({
      email: schema.string([
        rules.email(),
        rules.unique({ table: 'users', column: 'email' })
      ]),
      password: schema.string([
        rules.minLength(8)
      ]),
      username: schema.string(),
    })

    try {
      const payload = await request.validate({
        schema: storeSchema
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
          message: 'Berhasil menambahkan akun baru',
          status: 'success',
          result: userResponse
        }
      );
    } catch (error) {
      return response.badRequest({
        code: '400',
        errors: error.messages.errors
      })
    }
  }

  public async show({}: HttpContextContract) {}

  public async update({params, request ,response}: HttpContextContract) {

    const updateSchema = schema.create({
      email: schema.string([
        rules.email(),
        rules.unique({
          table: 'users',
          column: 'email',
          whereNot: {
            id: params.id,
          },
        })
      ]),
      username: schema.string(),
    })

    try{
      const payload = await request.validate({
        schema: updateSchema
      })

      const user = await User.findOrFail(params.id)
      user.username = payload.username
      await user.save()

      return response.status(201).send(
        {
          code: '201',
          message: 'Berhasil memperbaharui data',
          status: 'success',
          result: user
        }
      );
    } catch (error){
      return response.badRequest({
        code: '400',
        errors: error.messages.errors
      })
    }
  }

  public async destroy({params, response}: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()

      return response.status(201).send(
        {
          code: '201',
          message: 'Berhasil menghapus data',
          status: 'success',
          result: user
        }
      );
    } catch (e) {
      return response.badRequest({
        code: '400',
        errors: e.messages.errors
      })
    }
  }
}
