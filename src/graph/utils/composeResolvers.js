import { isArray, merge } from "lodash"

const marshalResolver = ({ resolvers = {}, defaults = {}, typeDefs = [] }) => ({
  resolvers,
  defaults,
  typeDefs: isArray(typeDefs) ? typeDefs : [ typeDefs ],
});

export default (...allResolvers) => allResolvers.map(marshalResolver).reduce((result, resolver) => ({
  resolvers: merge(result.resolvers, resolver.resolvers),
  defaults: merge(result.defaults, resolver.defaults),
  typeDefs: [...result.typeDefs, ...resolver.typeDefs],
}), marshalResolver({}));
