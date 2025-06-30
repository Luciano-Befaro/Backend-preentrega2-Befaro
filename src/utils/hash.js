import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const createHash = (password) => bcrypt.hashSync(password, SALT_ROUNDS);

export const validatePassword = (input, hashed) => bcrypt.compareSync(input, hashed);