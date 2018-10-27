import { toIdValue } from 'apollo-utilities';

export default {
  Query: {
    node(root, { id }) {
      return toIdValue(id);
    },
  },

  User: {
    chat(user, { id, recipientId }) {
      return id && toIdValue(id);
    },
  },
};
