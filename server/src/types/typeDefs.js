

const {gql} = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    createdAt: String!
    tags: [String!]
    likes: [Like!]! 
    comments: [Comment!]! 
  }

  type Comment {
    id: ID!
    content: String!
    author: User!
    post: Post!
    createdAt: String!
  }

  type Like {
    id: ID!
    author: User!
    post: Post!
    createdAt: String!
  }

  type Query {
    posts(cursor: String, limit: Int): [Post!]!
    post(id: ID!): Post
    comments(postId: ID!): [Comment!]!
    likes(postId: ID!): [Like!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    createPost(title: String!, content: String!, tags: [String!]): Post!
    createComment(postId: ID!, content: String!): Comment!
    likePost(postId: ID!): Like
  }
`;

module.exports = typeDefs;