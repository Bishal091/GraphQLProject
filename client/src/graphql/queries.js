import { gql } from "@apollo/client";

export const GET_POSTS = gql`
query GetPosts {
  posts {
      id
      title
      content
      author {
          id
          username
      }
      createdAt
      likes {
          id
          author {
              id
              username
          }
      }
      comments {
          id
      }
  }
}
`;
export const GET_POST_DETAILS = gql`
  query GetPostDetails($id: ID!) {
    post(id: $id) {
      id
      title
      content
      author {
        username
      }
      createdAt
      comments {
        id
        content
        createdAt
        author {
          username
        }
      }
    }
  }
`;