import { Component, OnInit } from "@angular/core";
import { PostService } from "./post.service";

import { Router } from "@angular/router";

@Component({
  selector: "app-posts",
  templateUrl: "./posts.component.html",
  styleUrls: ["./posts.component.css"],
})
export class PostsComponent implements OnInit {
  constructor(private postService: PostService, private router: Router) {}

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
