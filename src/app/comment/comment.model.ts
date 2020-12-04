export interface Comment {
  _id: string;
  comment: string;
  username: string;
  postId: string;
  userId: string;
}

export interface NestedComment {
  _id: string;
  commentId: string;
  comment: string;
  username: string;
  postId: string;
  userId: string;
}
