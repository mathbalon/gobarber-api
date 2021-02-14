import nodemailer, { Transporter } from 'nodemailer'
import { inject, injectable } from 'tsyringe'

import IMailProvider from '../models/IMailProvider'
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider'
import ISendMailDTO from '../dtos/ISendMailDTO'

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private cliente: Transporter

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      })

      this.cliente = transporter
    })
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const message = await this.cliente.sendMail({
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.email || 'equipe@gobarber.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    })

    console.log('Message sent: %s', message.messageId)
    console.log('Preview url: %s', nodemailer.getTestMessageUrl(message))
  }
}
