import { gql } from "@apollo/client";

// Mutation to create a new user (Register)
export const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

// Mutation to log in a user
export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;
// Mutation to create a new post
export const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $tags: [String!]) {
    createPost(title: $title, content: $content, tags: $tags) {
      id
      title
      content
      author {
        username
      }
      createdAt
    }
  }
`;

// Mutation to create a new comment
export const CREATE_COMMENT = gql`
  mutation CreateComment($postId: ID!, $content: String!) {
    createComment(postId: $postId, content: $content) {
      id
      content
      createdAt
      author {
        id
        username
      }
      post {
        id 
      }
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      author {
        id
        username
      }
      post {
        id
      }
    }
  }
`;
