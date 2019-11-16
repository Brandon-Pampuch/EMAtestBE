const graphql = require('graphql');
const User = require('../models/user')


const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull } = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        name: { type: GraphQLString },
        sub: { type: GraphQLString },
    })
})



const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: new GraphQLList(UserType),
            resolve(parent, args, context) {
                //return users
                return User.find({})
            }
        },
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                sub: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args, context) {
                console.log("sub in resolve", context.user.sub)
                let user = new User({
                    name: args.name,
                    sub: context.user.sub
                })
                let registeredUser = User.find({ sub: user.sub })
                console.log(registeredUser.getOptions.condition)


                // front end logic.
                if (registeredUser !== undefined) {
                    //user.save() + registered user
                } else {
                    //user pushed back or logged out
                }
                console.log("new user added")
                return user.save()

            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

