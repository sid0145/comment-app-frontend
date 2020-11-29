import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import { PostService } from "../post.service";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"],
})
export class PostCreateComponent implements OnInit {
  username: string;
  constructor(
    private authService: AuthService,
    private postService: PostService,
    private router: Router
  ) {
    this.username = authService.getUsername();
  }

  ngOnInit() {}

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.postService.createPost(
      this.username,
      form.value.title,
      form.value.content
    );
  }
  onCancel() {
    this.router.navigate(["/"]);
  }
}
