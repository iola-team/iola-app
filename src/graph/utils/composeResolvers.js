import { isArray, merge } from "lodash"

export default (...resolvers) => merge(...resolvers.map(({ resolvers, defaults, typeDefs }) => ({
  resolvers: resolvers || [],
  defaults: defaults || [],
  typeDefs: isArray(typeDefs) ? typeDefs : [ typeDefs ],
})))
