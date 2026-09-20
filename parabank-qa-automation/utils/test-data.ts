export type UserCredentials = {
  username: string;
  password: string;
};

export function createUniqueUser(): UserCredentials {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    username: `qa_${suffix}`,
    password: 'Password123'
  };
}