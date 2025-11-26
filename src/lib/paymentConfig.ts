// src/lib/paymentConfig.ts

export const PAYMENT_METHODS = {
    MERCADOPAGO: {
    label: 'Tarjeta de Crédito / Débito',
    description: 'Tarjetas (Automático).',
    type: 'REDIRECT',
    link: 'https://r.naranjax.com/ibLSUckC', 
    warning: null,
  },
  TRANSFER: {
    label: 'Transferencia Bancaria',
    description: 'CBU / Alias (Argentina).',
    type: 'MANUAL',
    warning: 'El pedido se procesará una vez verificado el comprobante.',
    data: {
      banco: 'Brubank',
      alias: 'agustinariera',
      cbu: '1430001713004354990011',
      titular: 'Agustina Soledad Riera'
    }
  },
  TIPFUNDER: {
    label: 'Tipfunder (Tarjeta)',
    description: 'Abonar en USD con tarjeta de crédito/débito desde cualquier país.',
    type: 'REDIRECT', 
    link: 'https://www.tipfunder.com/Cleopatrax19', 
    warning: null,
    data: {} // Vacío porque redirige
  },
  USDT: {
    label: 'USDT (Cripto)',
    description: 'Transferencia vía red TRC2 (tron).',
    type: 'MANUAL',
    warning: 'Revisa bien la red antes de enviar. Transferencias en otra red se perderán.',
    data: {
      network: 'TRC20 (Tron)', 
      address: 'TJ9XtdSxFQhLi8wBDzBVqg2u6gTBEDfkWQ', 
    }
  },
  AIRTM: {
    label: 'Airtm',
    description: 'Envío directo por correo electrónico.',
    type: 'MANUAL',
    warning: 'IMPORTANTE: En la sección de notas escribe SOLAMENTE un punto ".". No escribas nada más.',
    data: {
      email: 'Agust.riera16@gmail.com'
    }
  },
  SKRILL: {
    label: 'Skrill',
    description: 'Saldo en USD.',
    type: 'MANUAL',
    warning: 'IMPORTANTE: No coloques ninguna nota o comentario en el envío.',
    data: {
      email: 'Agust.riera16@gmail.com' // 
    }
  },
  PREX: {
    label: 'Prex a Prex',
    description: 'Transferencia internacional.',
    type: 'MANUAL',
    warning: 'Solo se aceptan transferencias en USD desde otra cuenta Prex.',
    data: {
      cuenta: '21333885 (Uruguay)',
      titular: 'Leonardo Gorosito'
    }
  }
} as const;

export type PaymentMethodKey = keyof typeof PAYMENT_METHODS;