import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from "App/Models/Product";
import {rules, schema} from "@ioc:Adonis/Core/Validator";
import {valid} from "semver";
import {req} from "pino-std-serializers";

export default class ProductsController {
  public async index({request, response}: HttpContextContract) {
    const products = await Product.all();

    return response.status(200).send({
      code: '200',
      message: 'Data berhasil di ambil',
      status: 'success',
      result: products,
    })
  }

  public async store({request, response}: HttpContextContract) {
    const validateSchema = schema.create({
      name: schema.string(),
      sku: schema.string(),
    })

    try {
      const payload = await request.validate({
        schema: validateSchema
      })
      try {

        const product = new Product()
        product.name = payload.name
        product.sku = payload.sku
        await product.save()

        return response.status(201).send(
          {
            code: '201',
            message: 'Berhasil menambah data',
            status: 'success',
            result: product
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
    const product = await Product.find(params.id);

    return response.status(200).send(
      {
        code: '200',
        message: 'Berhasil mengambil data',
        status: 'success',
        result: product
      }
    )
  }

  public async update({params,request,response}: HttpContextContract) {
    const validateSchema = schema.create({
      name: schema.string(),
      sku: schema.string(),
    })

    try {
      const payload = await request.validate({
        schema: validateSchema
      })

      try{
        const product = await Product.findOrFail(params.id)
        product.name = payload.name
        product.sku = payload.sku
        product.save()

        return response.status(201).send(
          {
            code: '201',
            message: 'Berhasil memperbaharui data',
            status: 'success',
            result: product
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
    const product = await Product.findOrFail(params.id);
    await product.delete()

    return response.status(201).send(
      {
        code: '201',
        message: 'Berhasil menghapus data',
        status: 'success',
      }
    );
  }
}
