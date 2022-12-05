import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Customer from "App/Models/Customer";
import {rules, schema} from "@ioc:Adonis/Core/Validator";

export default class CustomersController {
  public async index({request, response}: HttpContextContract) {
    const customers = await Customer.all();

    return response.status(200).send({
      code: '200',
      message: 'Data berhasil di ambil',
      status: 'success',
      result: customers,
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

        const customer = new Customer()
        customer.name = payload.name
        customer.address = payload.address
        await customer.save()

        return response.status(201).send(
          {
            code: '201',
            message: 'Berhasil menambah data',
            status: 'success',
            result: customer
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
    const customer = await Customer.find(params.id);

    return response.status(200).send(
      {
        code: '200',
        message: 'Berhasil mengambil data',
        status: 'success',
        result: customer
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
        const customer = await Customer.findOrFail(params.id)
        customer.name = payload.name
        customer.address = payload.address
        customer.save()

        return response.status(201).send(
          {
            code: '201',
            message: 'Berhasil memperbaharui data',
            status: 'success',
            result: customer
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
    const customer = await Customer.findOrFail(params.id);
    await customer.delete()

    return response.status(201).send(
      {
        code: '201',
        message: 'Berhasil menghapus data',
        status: 'success',
      }
    );
  }
}
