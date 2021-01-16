const express = require('express');
const app = express();

const { graphqlHTTP } = require('express-graphql');
// una de las funciones que se utilizaran de graphql es la funcionalidad de crear schemas
// un schema es una manera de poder definir como van a lucir nuestros datos.
const { buildSchema } = require('graphql');

const { courses } = require('./data.json');

// id: Int! = el signo de admiracion es para definir que el parametro es requerido
const schema = buildSchema(`
    type Query {
        course(id: Int!)
    }

    type Course {
        id: Int
        title: String
        description: String
        author: String
        topic: String
        url: String
    }
`);
const root = {
    message: () => 'Hello World testing'
}

// integracion de los modulos de graphql y express-graphql
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    // to enable the client to consult graphql
    graphiql: true
}));

app.listen(4000, () => {
    console.log('Server listen on port 4000');
});