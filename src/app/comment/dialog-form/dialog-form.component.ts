import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { CommentService } from "../comment.service";
import { DialogData } from "./dialog.interface";

@Component({
  selector: "app-dialog-form",
  templateUrl: "./dialog-form.component.html",
  styleUrls: ["./dialog-form.component.css"],
})
export class DialogFormComponent implements OnInit {
  commentForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private commentService: CommentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initilizeForm();
    console.log(this.data);
    if (this.data && this.data.id) {
      console.log(this.data);
      console.log(this.data.id);
      this.setCommentToForm(this.data.id);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  //inilizating form
  private initilizeForm() {
    this.commentForm = this.fb.group({
      comment: ["", Validators.required],
    });
  }

  private setCommentToForm(id: string) {
    this.commentService.getCommentById(id).subscribe(
      (data) => {
        this.commentForm.patchValue(data);
      },
      (err) => {
        this.snackBar.open(err, "error");
      }
    );
  }

  //updating client
  // private updateClient(id: string) {
  //   this.commentService.getCommentById(id).subscribe(
  //     (data) => {
  //       this.commentForm.patchValue(data);
  //     },
  //     (err) => {
  //       this.snackBar.open("error occured!", "error", {
  //         duration: 2000,
  //       });
  //     }
  //   );
  // }
}
