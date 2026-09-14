import { faker } from '@faker-js/faker';

/**
 * O campo Subjects é um autocomplete que só aceita valores do catálogo.
 * State e City são react-selects encadeados: a cidade precisa pertencer
 * ao estado escolhido, então os pares ficam acoplados aqui.
 */
const MATERIAS = ['Maths', 'English', 'Chemistry', 'Physics', 'Computer Science', 'Economics'];
const HOBBIES = ['Sports', 'Reading', 'Music'];
const GENEROS = ['Male', 'Female', 'Other'];

const ESTADOS = [
  { estado: 'NCR', cidades: ['Delhi', 'Gurgaon', 'Noida'] },
  { estado: 'Uttar Pradesh', cidades: ['Agra', 'Lucknow', 'Merrut'] },
  { estado: 'Haryana', cidades: ['Karnal', 'Panipat'] },
  { estado: 'Rajasthan', cidades: ['Jaipur', 'Jaiselmer'] },
];

export const buildFormData = () => {
  const localidade = faker.helpers.arrayElement(ESTADOS);

  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    gender: faker.helpers.arrayElement(GENEROS),
    // O campo aceita exatamente 10 dígitos.
    mobile: faker.string.numeric(10),
    dateOfBirth: {
      dia: faker.number.int({ min: 1, max: 28 }),
      mes: faker.number.int({ min: 0, max: 11 }),
      ano: faker.number.int({ min: 1970, max: 2005 }),
    },
    subject: faker.helpers.arrayElement(MATERIAS),
    hobby: faker.helpers.arrayElement(HOBBIES),
    arquivo: 'cypress/fixtures/upload-teste.txt',
    address: faker.location.streetAddress(),
    state: localidade.estado,
    city: faker.helpers.arrayElement(localidade.cidades),
  };
};