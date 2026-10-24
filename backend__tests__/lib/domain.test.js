'use strict';

const domain = require('../../backend/lib/domain');

describe('domain', () => {
  test('getParentDomain retorna dominio padre', () => {
    expect(domain.getParentDomain('archivospublicos.jotace.cl')).toBe('jotace.cl');
  });

  test('getHostAccount retorna HOST_ACCOUNT fuera de producción', () => {
    process.env.NODE_ENV = 'development';
    process.env.HOST_ACCOUNT = 'https://account.local';

    const req = {
      protocol: 'https',
      headers: {
        host: 'www.jotace.cl',
      },
    };

    expect(domain.getHostAccount(req)).toBe('https://account.local');
  });

  test('getHostArchivosPublicos retorna HOST_ARCHIVOSPUBLICOS fuera de producción', () => {
    process.env.NODE_ENV = 'development';
    process.env.HOST_ARCHIVOSPUBLICOS = 'https://archivos.local';

    const req = {
      protocol: 'https',
      headers: {
        host: 'www.jotace.cl',
      },
    };

    expect(domain.getHostArchivosPublicos(req)).toBe('https://archivos.local');
  });
});
