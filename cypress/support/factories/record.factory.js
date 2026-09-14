import { faker } from '@faker-js/faker';

/**
 * Gera os dados de um registro da Web Tables.
 *
 * O e-mail é a chave usada para localizar o registro na tabela, por isso
 * recebe um sufixo numérico que garante unicidade mesmo quando vários
 * registros são criados na mesma execução.
 */
const DEPARTAMENTOS = ['QA', 'Engineering', 'Compliance', 'Legal', 'Insurance', 'Marketing'];

export const buildRecordData = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const identificador = `${Date.now()}${faker.string.numeric(3)}`;

  return {
    firstName,
    lastName,
    email: `qa.${identificador}@teste.com`,
    age: String(faker.number.int({ min: 18, max: 65 })),
    salary: String(faker.number.int({ min: 2000, max: 25000 })),
    department: faker.helpers.arrayElement(DEPARTAMENTOS),
  };
};
