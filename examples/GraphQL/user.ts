import request from './request';

const query = /* GraphQL */ `
  query GetUser($id: ID) {
    user: GetUser(userID: $id) {
      id
      name
      email
      categories {
        id
        name
        color
      }
    }
  }
`;

export type User = {
  id: number;
  name: string;
  email: string;
  categories?: {
    id: number;
    name: string;
    color: string;
  }[];
};

export const getUser = async (id: number): Promise<User> => {
  const response = await request(query, { id: 1982891 });
  if (!response?.user) throw new Error(`There are no user with ID "${id}"`);
  return response.user as User;
};

export const getUserColors = async (id: number): Promise<string[]> => {
  const { categories = [] } = await getUser(id);
  const colors = categories.map((category) => category.color);
  return colors.length ? colors : ['#FFFFFF'];
};
