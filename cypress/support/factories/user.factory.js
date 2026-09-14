import { faker } from '@faker-js/faker';

/**
 * Gera um usuário único a cada execução.
 * A API retorna 406 ("User exists!") para userName repetido,
 * então o timestamp garante que o teste seja reexecutável.
 *
 * A senha precisa atender à política do demoqa:
 * mínimo 8 caracteres, com maiúscula, minúscula, número e especial.
 */
export const buildUser = () => {
  const lower = faker.string.alpha({ length: 4, casing: 'lower' });
  const upper = faker.string.alpha({ length: 2, casing: 'upper' });
  const digits = faker.number.int({ min: 1000, max: 9999 });

  return {
    userName: `jeff_qa_${Date.now()}`,
    password: `${upper}${lower}${digits}@`,
  };
};
