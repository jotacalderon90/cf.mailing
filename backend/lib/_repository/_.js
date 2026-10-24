'use strict';

const validMotor = ['mongo'];

if (validMotor.indexOf(process.env.DB_MOTOR) === -1) {
  console.log('Motor de BD inválido');
  process.exit(0);
}

module.exports = {
  smtp: require('./' + process.env.DB_MOTOR + '/smtp'),
  mailing: require('./' + process.env.DB_MOTOR + '/mailing'),
  mailing_seen: require('./' + process.env.DB_MOTOR + '/mailing_seen'),
};
