import { Component, OnInit } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { remove } from "lodash";
import { filter, flatMap } from "rxjs/operators";

import { AuthService } from "../auth/auth.service";
import { PostService } from "../posts/post.service";
import { CommentService } from "./comment.service";
import { DialogFormComponent } from "./dialog-form/dialog-form.component";
import { Subject } from "rxjs";

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
  postId: string;
  commentCount;
  isLoading: boolean = false;
  subject = new Subject<any>();

  comments = [];
  allComments = [];
  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private authService: AuthService,
    private commentService: CommentService,
    private snackBar: MatSnackBar
  ) {
    this.getIdOfthePost();
  }

  ngOnInit() {
    this.getpostIdandPopulate();
    this.getCommentsofPost();
    this.countCommnet();
    this.userId = this.authService.getUserId();
  }
  //get id of the post
  private getIdOfthePost() {
    this.route.params.subscribe((params) => {
      this.postId = params["id"];
    });
  }

  //print the comments of the post
  private getCommentsofPost() {
    this.commentService
      .getCommentByPostId(this.postId)
      .subscribe((data: { comments: any }) => {
        for (let i = 0; i < data.comments.length; i++) {
          this.comments.push(data.comments[i]);
        }
      });
  }
  //count comment

  private countCommnet() {
    this.commentService.getCountOfComment(this.postId).subscribe((data) => {
      this.commentCount = data;
    });
  }

  //get post and populate on the top of the comments
  private getpostIdandPopulate() {
    this.postService.getPost(this.postId).subscribe(
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
  }

  //reply function with edit also
  openDialog(id: string): void {
    const options = {
      width: "400px",
      height: "250px",
      data: {},
    };
    if (id) {
      options.data = { id: id };
    }

    const dialogRef = this.dialog.open(DialogFormComponent, options);
    dialogRef.afterClosed().subscribe((result) => {
      if (id) {
        this.commentService
          .updateCommentById(id, result.comment, this.postId)
          .subscribe((data) => {
            const index = this.comments.findIndex(
              (comment) => comment._id === id
            );
            this.comments[index].id = id;
            this.comments[index].comment = result.comment;
            this.comments[index].postId = this.postId;
            this.comments[index].username = this.username;
            this.comments[index].userId = this.userId;
            this.comments = [...this.comments];
            this.snackBar.open("you updated this comment", "success", {
              duration: 2000,
            });
          });
      } else {
        this.commentService
          .createComment(result.comment, this.postId)
          .subscribe((data) => {
            this.comments.push(data);
            this.comments = [...this.comments];
            this.countCommnet();
            this.snackBar.open("you commented on this post", "success", {
              duration: 2000,
            });
          });
      }
    });
  }

  //delete  handler
  //deleting a comment
  delteHandler(id: string) {
    console.log(id);
    this.commentService.deleteComment(id).subscribe(
      (data: any) => {
        remove(this.comments, (comment) => {
          return comment._id === data._id;
        });
        this.comments = [...this.comments];
        this.commentCount -= 1;
        this.snackBar.open("you deleted this comment", "success", {
          duration: 2000,
        });
      },
      (err) => {
        this.snackBar.open("oop's something went wrong", "error", {
          duration: 2000,
        });
      }
    );
  }
}
