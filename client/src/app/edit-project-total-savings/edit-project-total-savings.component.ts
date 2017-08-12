import { Component, OnInit, Inject } from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-edit-project-total-savings',
  templateUrl: './edit-project-total-savings.component.html',
  styleUrls: ['./edit-project-total-savings.component.css']
})
export class EditProjectTotalSavingsComponent implements OnInit {

  constructor(
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<EditProjectTotalSavingsComponent>) { }

  ngOnInit() {
  }

}
