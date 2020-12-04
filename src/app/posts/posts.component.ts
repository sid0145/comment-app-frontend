import { Component, OnInit } from "@angular/core";
import { PostService } from "./post.service";

import { Router } from "@angular/router";
import { CommentService } from "../comment/comment.service";

@Component({
  selector: "app-posts",
  templateUrl: "./posts.component.html",
  styleUrls: ["./posts.component.css"],
})
export class PostsComponent implements OnInit {
  constructor(
    private postService: PostService,
    private router: Router,
    private commentService: CommentService
  ) {}

  posts = [];
  isLoading: boolean = false;

  ngOnInit() {
    this.postService.getPosts().subscribe((result: { posts: any }) => {
      this.isLoading = true;
      for (var i = 0; i < result.posts.length; i++) {
        this.posts.unshift(result.posts[i]);
      }
      this.isLoading = false;
    });
  }

  openComment(id) {
    this.router.navigate(["comments", id]);
  }
}
