import { users } from "../data/mock/users";

const wait = (value, delay = 300) =>
  new Promise((resolve) => setTimeout(() => resolve(value), delay));

export const userService = {
  list: () => wait([...users]),
  get: (id) => wait(users.find((user) => user.id === id)),
  create: (user) => {
    users.push(user);
    return wait(user);
  },
  update: (id, values) => {
    const item = users.find((user) => user.id === id);
    Object.assign(item, values);
    return wait(item);
  },
};
export default userService;
