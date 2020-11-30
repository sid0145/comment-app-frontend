import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../auth/auth.service";

import { environment } from "../../environments/environment";
import { Router } from "@angular/router";

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: "root",
})
export class PostService {
  username: string;

  constructor(private http: HttpClient, private router: Router) {}

  //create posts
  createPost(username: string, title: string, content: string) {
    const data = { username: username, title: title, content: content };
    this.http.post(`${BACKEND_URL}/create-post`, data).subscribe((result) => {
      this.router.navigate(["/"]);
    });
  }

  //getting posts
  getPosts() {
    return this.http.get(`${BACKEND_URL}/posts`);
  }

  //get post by id
  getPost(id) {
    return this.http.get(`${BACKEND_URL}/post/${id}`);
  }
}
