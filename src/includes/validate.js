import {
  Form as VeeForm,
  Field as VeeField,
  ErrorMessage,
  defineRule,
  configure
} from 'vee-validate'
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  min_value as minVal,
  max_value as maxVal,
  confirmed,
  not_one_of as excluded
} from '@vee-validate/rules'

export default {
  install(app) {
    app.component('VeeField', VeeField)
    app.component('VeeForm', VeeForm)
    app.component('ErrorMessage', ErrorMessage)

    defineRule('required', required)
    defineRule('tos', required)
    defineRule('min', min)
    defineRule('max', max)
    defineRule('alpha_spaces', alphaSpaces)
    defineRule('email', email)
    defineRule('min_value', minVal)
    defineRule('max_value', maxVal)
    defineRule('confirmed', confirmed)
    defineRule('passwords_mismatch', confirmed)
    defineRule('excluded', excluded)

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `The field ${ctx.field} is required.`,
          tos: `You must accept our Terms of Service`,
          min: `The field ${ctx.field} is too short.`,
          max: `The field ${ctx.field} is too long.`,
          alpha_spaces: `The field ${ctx.field} may only contains letters and spaces.`,
          email: `The field ${ctx.field} must be a valid email.`,
          min_value: `The field ${ctx.field} is too low.`,
          max_value: `The field ${ctx.field} is too high.`,
          excluded: `You are not allowed to use this value for the field ${ctx.field}.`,
          passwords_mismatch: `The passwords don't match`
        }
        return messages[ctx.rule.name] || `The field ${ctx.field} is invalid.`
      }
      // validateOnBlur: true,
      // validateOnChange: true,
      // validateOnInput: false,
      // validateOnModelUpdate: true
    })
  }
}
