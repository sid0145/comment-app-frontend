import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../environments/environment";
import { Observable, Subject } from "rxjs";

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: "root",
})
export class CommentService {
  constructor(private http: HttpClient) {}

  //create a comment
  createComment(comment: string, postId: string): Observable<Comment> {
    const data = { comment: comment, postId: postId };
    return this.http.post<Comment>(`${BACKEND_URL}/comments`, data);
  }

  //get comment by post id
  getCommentByPostId(postId: string) {
    return this.http.get(`${BACKEND_URL}/commentBypostId/${postId}`);
  }

  //get count of the comments
  getCountOfComment(postId: string) {
    return this.http.get(`${BACKEND_URL}/commentCount/${postId}`);
  }

  //get comment by id
  getCommentById(id: string): Observable<Comment> {
    return this.http.get<Comment>(`${BACKEND_URL}/comment/${id}`);
  }

  //update client
  updateCommentById(id: string, comment: string, postId: string) {
    const body = { comment: comment, postId: postId };
    return this.http.put<Comment>(`${BACKEND_URL}/comment/${id}`, body);
  }

  //deleting comment
  deleteComment(id: string): Observable<Comment> {
    return this.http.delete<Comment>(`${BACKEND_URL}/comments/${id}`);
  }
}
