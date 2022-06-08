import Joi from 'joi'

const imageUpdateSchema = Joi.object({
  uuid: Joi.string()
    .uuid()
    .required(),

  title: Joi.string()
    .max(30)
    .min(3)
    .optional(),

  description: Joi.string()
    .max(255)
    .optional(),

  fileLocation: Joi.string()
    .uri()
}).options({ abortEarly: false })

const imageCreateSchema = Joi.object({
  title: Joi.string()
    .max(30)
    .min(3)
    .required(),

  description: Joi.string()
    .max(255),

  fileLocation: Joi.string()
    .uri()
    .required()
}).options({ abortEarly: false })

const pathParamsWithUuidSchema = Joi.object({
  pathParameters: Joi.object({
    uuid: Joi.string()
      .uuid()
      .required()
  }).required()
})

export {
  imageUpdateSchema,
  imageCreateSchema,
  pathParamsWithUuidSchema
}
