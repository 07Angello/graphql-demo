const express = require('express');
const app = express();

const { graphqlHTTP } = require('express-graphql');
// una de las funciones que se utilizaran de graphql es la funcionalidad de crear schemas
// un schema es una manera de poder definir como van a lucir nuestros datos.
const { buildSchema } = require('graphql');

const { courses } = require('./data.json');

// id: Int! = el signo de admiracion es para definir que el parametro es requerido
// para obtener una coleccion de mas de un registro se usa el signo de Array [] para decirle al query que obtenga un listado
const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    }
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
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

const getCourse = (course) => {
    let courseId = course.id
    let returnedCourse = courses.filter(course => {
        return course.id == courseId;
    })[0];
    //[0] es para darle que devuelva un unico registro del arreglo que devuelve el filter

    return returnedCourse;
}

const getCourses = (args) => {
    if(args.topic) {
        let topic = args.topic;
        return courses.filter(course => {
            return course.topic == topic;
        })
    } else {
        return courses;
    }
}

const updateCourseTopic = ({id, topic}) => {
    courses.map(course => {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    });

    return courses.filter(course => course.id === id)[0];
}

//aqui se definen las funciones
const root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic
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