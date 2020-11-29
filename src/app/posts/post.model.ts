export interface AddPostResp {
  message: string;
  username: string;
  userId: string;
}

export interface getPostsResp {
  message: string;
  username: string;
  title: string;
  content: string;
}

export interface Post {
  id: string;
  title: string;
  username: string;
  content: string;
}
