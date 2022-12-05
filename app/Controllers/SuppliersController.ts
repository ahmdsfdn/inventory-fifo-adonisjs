import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Supplier from "App/Models/Supplier";
import {rules, schema} from "@ioc:Adonis/Core/Validator";

export default class SuppliersController {
  public async index({request, response}: HttpContextContract) {
    const suppliers = await Supplier.all();

    return response.status(200).send({
      code: '200',
      message: 'Data berhasil di ambil',
      status: 'success',
      result: suppliers,
    })
  }

  public async store({request, response}: HttpContextContract) {
    const validateSchema = schema.create({
      name: schema.string(),
      address: schema.string(),
    })

    try {
      const payload = await request.validate({
        schema: validateSchema
      })
      try {

        const supplier = new Supplier()
        supplier.name = payload.name
        supplier.address = payload.address
        await supplier.save()

        return response.status(201).send(
          {
            code: '201',
            message: 'Berhasil menambah data',
            status: 'success',
            result: supplier
          }
        );

      } catch (e) {
        return response.badRequest({
          code: '400',
          errors: e.message
        })
      }
    } catch (e) {
      return response.badRequest({
        code: '400',
        errors: e.messages.errors
      })
    }
  }

  public async show({response,params}: HttpContextContract) {
    const supplier = await Supplier.find(params.id);

    return response.status(200).send(
      {
        code: '200',
        message: 'Berhasil mengambil data',
        status: 'success',
        result: supplier
      }
    )
  }

  public async update({params,request,response}: HttpContextContract) {
    const validateSchema = schema.create({
      name: schema.string(),
      address: schema.string(),
    })

    try {
      const payload = await request.validate({
        schema: validateSchema
      })

      try{
        const supplier = await Supplier.findOrFail(params.id)
        supplier.name = payload.name
        supplier.address = payload.address
        supplier.save()

        return response.status(201).send(
          {
            code: '201',
            message: 'Berhasil memperbaharui data',
            status: 'success',
            result: supplier
          }
        );
      } catch (e) {
        return response.badRequest({
          code: '400',
          errors: e.message
        })
      }

    } catch (e) {
      return response.badRequest({
        code: '400',
        errors: e.messages.errors
      })
    }
  }

  public async destroy({params,response}: HttpContextContract) {
    const supplier = await Supplier.findOrFail(params.id);
    await supplier.delete()

    return response.status(201).send(
      {
        code: '201',
        message: 'Berhasil menghapus data',
        status: 'success',
      }
    );
  }
}
