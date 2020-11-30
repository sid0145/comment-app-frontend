import { Component, OnInit } from "@angular/core";
import { PostService } from "./post.service";

import { Post } from "./post.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-posts",
  templateUrl: "./posts.component.html",
  styleUrls: ["./posts.component.css"],
})
export class PostsComponent implements OnInit {
  constructor(private postService: PostService, private router: Router) {}

  posts = [];

  ngOnInit() {
    this.postService.getPosts().subscribe((result: { posts: any }) => {
      for (var i = 0; i < result.posts.length; i++) {
        this.posts.unshift(result.posts[i]);
      }
    });
  }

  openComment(id) {
    console.log(id);
    this.router.navigate(["comments", id]);
  }
}
