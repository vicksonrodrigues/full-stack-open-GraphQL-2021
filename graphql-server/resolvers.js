const { UserInputError,AuthenticationError} = require('apollo-server')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')


const jwt = require('jsonwebtoken')
const JWT_SECRET = 'LIBRARYSECRET1234'

const addNewAuthorWithName = (name) => {
  const author = new Author({ name })
  return author.save()
}

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () =>  Author.collection.countDocuments(),
    allBooks: async(root,args) => {
      /*
      if (!args.author && !args.genre)
        return books
      else if (args.author && args.genre)
        return books.filter(b => b.author === args.author && b.genres.includes(args.genre))
      else if (args.author)
        return books.filter(b => b.author === args.author)
      else if (args.genre)
        return books.filter(b => b.genres.includes(args.genre))
        */
      const books = await Book.find({})
      if(!args.genre)
      {
        return books
      }
      return books.filter(b => b.genres.includes(args.genre))
    },
    allAuthor: () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Book: {
    author: (book) =>  Author.findById(book.author)
  },
  Author: {
    bookCount: (author) => Book.countDocuments({author: author.id})
  },

  Mutation:{
    addBook: async(root,args,context)=> {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError('Not authenticated!')
      }

    const author = await Author.findOne({name: args.author}) || await addNewAuthorWithName(args.author)
    const book = new Book({...args, author})
      
    try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      pubsub.publish('BOOK_ADDED',{bookAdded: book})

      return book
    },

    addAuthor: async (root, args) => {
      const author = new Author({ ...args })
      try {
        await author.save()
      } catch (e) {
        throw new UserInputError(e?.message, { invalidArgs: args })
      }
      return author
    },

    editAuthor:async(root,args,context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError('Not authenticated!')
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null 
      }
      author.born = args.setBornTo
      try {
        return await author.save()
      } catch (e) {
        throw new UserInputError(e?.message, { invalidArgs: args })
      }
    },

    createUser: async (root, args) => {
      const user = new User({ username: args.username ,favoriteGenre:args.favoriteGenre})
  
      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new UserInputError("wrong credentials")
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded:{
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },
}

module.exports = resolvers