import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../environments/environment";
import { Observable, Subject } from "rxjs";
import { NestedComment } from "./comment.model";

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: "root",
})
export class CommentService {
  constructor(private http: HttpClient) {}

  //------------------single comment here ------------
  //create a comment
  createComment(comment: string, postId: string): Observable<Comment> {
    const data = { comment: comment, postId: postId };
    return this.http.post<Comment>(`${BACKEND_URL}/comments`, data);
  }

  //get all comments by post id
  getCommentByPostId(postId: string) {
    return this.http.get(`${BACKEND_URL}/commentBypostId/${postId}`);
  }

  //get count of the comments
  getCountOfComment(postId: string) {
    return this.http.get(`${BACKEND_URL}/commentCount/${postId}`);
  }

  //get higer level comment postid
  getCommentById(id: string): Observable<Comment> {
    return this.http.get<Comment>(`${BACKEND_URL}/comment/${id}`);
  }

  //update the higher level comment
  updateCommentById(id: string, comment: string, postId: string) {
    const body = { comment: comment, postId: postId };
    return this.http.put<Comment>(`${BACKEND_URL}/comment/${id}`, body);
  }

  //deleting a higher level comment
  deleteComment(id: string): Observable<Comment> {
    return this.http.delete<Comment>(`${BACKEND_URL}/comments/${id}`);
  }

  //-----------------------------------------------nested comment logic ---------------
  // post the nested comment
  createMultiComment(
    comment: string,
    postId: string,
    commentId: string
  ): Observable<NestedComment> {
    const data = { comment: comment, postId: postId, commentId: commentId };
    return this.http.post<NestedComment>(`${BACKEND_URL}/createMulti`, data);
  }
  //get all nested comment with postId
  getMultiComment(id: string): any {
    return this.http.get(`${BACKEND_URL}/getComments/${id}`);
  }

  //get a single nested comment
  getNestedCommentById(id: string): Observable<NestedComment> {
    return this.http.get<NestedComment>(
      `${BACKEND_URL}/getNestedComment/${id}`
    );
  }

  //edit handler for  a nested comment
  updateNestedCommentById(
    id: string,
    commentId: string,
    comment: string,
    postId: string
  ) {
    const data = { commentId: commentId, comment: comment, postId: postId };
    return this.http.put<NestedComment>(
      `${BACKEND_URL}/updateNestedComment/${id}`,
      data
    );
  }

  //delete handler for nested comment
  deleteNestedComment(id: string): Observable<NestedComment> {
    return this.http.delete<NestedComment>(`${BACKEND_URL}/multiComment/${id}`);
  }
}
