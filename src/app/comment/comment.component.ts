import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../auth/auth.service";

import { PostService } from "../posts/post.service";
import { DialogFormComponent } from "./dialog-form/dialog-form.component";

@Component({
  selector: "app-comment",
  templateUrl: "./comment.component.html",
  styleUrls: ["./comment.component.css"],
})
export class CommentComponent implements OnInit {
  title: string;
  username: string;
  content: string;
  userId: string;
  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getpostIdandPopulate();
    this.userId = this.authService.getUserId();
    console.log(this.userId);
  }
  // get post by id and set to the top of the view

  private getpostIdandPopulate() {
    this.route.params.subscribe((params) => {
      let id = params["id"];
      console.log("comment id:" + id);
      this.postService.getPost(id).subscribe(
        (post: {
          id: string;
          username: string;
          title: string;
          content: string;
        }) => {
          this.title = post.title;
          this.content = post.content;
          this.username = post.username;
        },
        (err) => {
          this.toastr.error("something went wrong!", "error", {
            timeOut: 2000,
          });
        }
      );
    });
  }

  //reply function
  openDialog(id: string): void {
    const options = {
      width: "400px",
      height: "350px",
      data: { id: id },
    };

    const dialogRef = this.dialog.open(DialogFormComponent, options);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      //check if result is valid or not
    });
  }
}
