import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { PostService } from "./post.service";

import { Post } from "./post.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-posts",
  templateUrl: "./posts.component.html",
  styleUrls: ["./posts.component.css"],
})
export class PostsComponent implements OnInit {
  constructor(private postService: PostService) {}

  posts = [];

  ngOnInit() {
    this.postService.getPosts().subscribe((result: { posts: Post[] }) => {
      this.posts = result.posts;
    });
  }
}
