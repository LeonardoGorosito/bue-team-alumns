// src/lib/paymentConfig.ts

export const PAYMENT_METHODS = {
    MERCADOPAGO: {
    label: 'MERADOPAGO',
    description: 'Tarjetas, Rapipago, PagoFácil (Automático).',
    type: 'REDIRECT',
    link: 'https://www.mercadopago.com/tu_link_de_pago', // <--- TU LINK DE MERCADOPAGO
    warning: null,
  },
  TRANSFER: {
    label: 'Transferencia Bancaria',
    description: 'CBU / Alias (Argentina).',
    type: 'MANUAL',
    warning: 'El pedido se procesará una vez verificado el comprobante.',
    data: {
      banco: 'Santander / Galicia',
      alias: 'TU.ALIAS.MP',
      cbu: '00000000000000000000',
      titular: 'Tu Nombre'
    }
  },
  TIPFUNDER: {
    label: 'Tipfunder (Tarjeta)',
    description: 'Abonar en USD con tarjeta de crédito/débito desde cualquier país.',
    type: 'REDIRECT', 
    link: 'https://tipfunder.com/TU_USUARIO', // <--- TU LINK DE TIPFUNDER
    warning: null,
    data: {} // Vacío porque redirige
  },
  USDT: {
    label: 'USDT (Cripto)',
    description: 'Transferencia vía red TRC20 o BEP20.',
    type: 'MANUAL',
    warning: 'Revisa bien la red antes de enviar. Transferencias en otra red se perderán.',
    data: {
      network: 'TRC20 (Tron)', 
      address: 'TU_BILLETERA_USDT_AQUI_XXXXXXXX', // <--- PON TU WALLET
    }
  },
  AIRTM: {
    label: 'Airtm',
    description: 'Envío directo por correo electrónico.',
    type: 'MANUAL',
    warning: 'IMPORTANTE: En la sección de notas escribe SOLAMENTE un punto ".". No escribas nada más.',
    data: {
      email: 'tu_email_airtm@ejemplo.com', // <--- PON TU EMAIL
      usuario: '@tu_usuario_airtm'
    }
  },
  SKRILL: {
    label: 'Skrill',
    description: 'Saldo en USD.',
    type: 'MANUAL',
    warning: 'IMPORTANTE: No coloques ninguna nota o comentario en el envío.',
    data: {
      email: 'tu_email_skrill@ejemplo.com' // <--- PON TU EMAIL
    }
  },
  PREX: {
    label: 'Prex a Prex',
    description: 'Transferencia internacional.',
    type: 'MANUAL',
    warning: 'Solo se aceptan transferencias en USD desde otra cuenta Prex.',
    data: {
      cuenta: 'XXXXXXX (Argentina)', // <--- PON TUS DATOS
      titular: 'Tu Nombre Completo'
    }
  }
} as const;

export type PaymentMethodKey = keyof typeof PAYMENT_METHODS;