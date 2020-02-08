const users = [
    { id: 0, name: 'Tom', sex: 0 },
    { id: 1, name: 'Bob', sex: 0 },
    { id: 2, name: 'Alick', sex: 1 }
];
const books = [
    { id: 0, title: 'Tom Book 1', author: users[0] },
    { id: 1, title: 'Tom Book 2', author: users[0] },
    { id: 2, title: 'Tom Book 3', author: users[0] },
    { id: 3, title: 'Bob Book 1', author: users[1] },
    { id: 4, title: 'Bob Book 2', author: users[1] },
    { id: 5, title: 'Alick Book 1', author: users[2] }
];
const userResolver = ({ id }) => users.filter(u => u.id == id)[0];
const usersResolver = () => users;

const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
    # Query 型別是所有 GraphQL 查詢的 root
    type Query {
        "A simple type for getting started!"
        hello: String
        users: [User]
        books: [Book]
    }

    # User 型別
    type User {
        id: Int
        name: String
        sex: Int
        myBook: getMyBook!
    }
    type getMyBook {
        success: Boolean!
        books: [Book]
    }

    # Book 型別
    type Book {
        id: Int
        title: String
        author: User
    }

    type addUser {
        success: Boolean!
        users: [User]!
    }
    type getUserById {
        success: Boolean!
        user: User
    }
    type addBook {
        success: Boolean!
        newBook: Book
    }
    type Mutation {
        addUser(name: String!, sex: Int!): addUser
        getUser(id: Int!): getUserById
        addBook(title: String!, author_id: Int!): addBook
    }
`;

const resolvers = {
    Query: {
        hello: () => 'world',
        users: () => users,
        books: () => books
    },
    User: {
        myBook: (_) => {
            let mybooks = [];
            // console.log('books.length = ' + books.length);
            for(let i = 0; i < books.length; i++) {
                if(books[i].author.id == _.id) {
                    mybooks.push(books[i]);
                }
            }
            if(mybooks.length > 0) {
                return {
                    success: true,
                    books: mybooks
                };
            } else {
                return {
                    success: false
                };
            }
        }
    },
    Mutation: {
        addUser: (_, { name, sex }) => {
            let id = users.length;
            users.push({
                id: id,
                name: name,
                sex: sex
            });
            return {
                success: true, users: users
            };
        },
        getUser: (_, { id }) => {
            // console.log(id);
            if(users[id] == undefined) {
                return {
                    success: false
                }
            } else {
                return {
                    success: true,
                    user: users[id]
                }
            }
        },
        addBook: (_, { title, author_id }) => {
            var t = title.trim();
            if(t.length <= 0) {
                console.log('err: no title');
                return {
                    success: false
                }
            } else {
                console.log('author: ' + author_id);
                var find_user = false;
                for(let i = 0; i < users.length; i++) {
                    if(users[i].id == author_id) {
                        find_user = true;
                        break;
                    }
                }
                if(find_user) {
                    console.log('add book success');
                    var new_book = {
                        id: books.length,
                        title: title,
                        author: author_id
                    }
                    books.push(new_book);
                    return {
                        success: true,
                        newBook: new_book
                    };
                } else {
                    console.log('err: no user');
                    return {
                        success: false
                    }
                }
            }
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen().then(({ url }) => {
    console.log(`? Server ready at ${url}`);
});