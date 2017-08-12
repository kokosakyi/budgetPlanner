import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MdDialog } from '@angular/material';
import { DeleteProjectComponent } from '../delete-project/delete-project.component';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  allProjects;
  totalProjects: number = 0;
  hasProjects: boolean = false;
  message;
  response: boolean = false;
  project_id;

  constructor(
    public router: Router,
    public projectService: ProjectService,
    public _flashMessagesService: FlashMessagesService,
    public dialog: MdDialog,
    public changeDetectorRef: ChangeDetectorRef
  ) {
    this.getAllProjects();
  }

  ngOnInit() {

    //console.log(JSON.stringify(this.allProjects));
  }

  openProject() {
    this.router.navigate(['/project']);
  }

  // Function to get all blogs from the database
  getAllProjects() {
    // Function to GET all blogs from database
    this.projectService.getAllProjects().subscribe(data => {
      this.allProjects = data.projects; // Assign array to use in HTML
      this.totalProjects = this.allProjects.length;
      if (this.totalProjects > 0) {
        this.hasProjects = true;
      }
    });
  }



  // Function to delete blogs
  deleteProject() {
    // Function for DELETE request
    this.projectService.deleteProject(this.project_id).subscribe(data => {
      // Check if delete request worked
      if (!data.success) {
        this.message = data.message; // Return error message
        this._flashMessagesService.show(this.message, { cssClass: 'alert-danger', timeout: 1500 });
      } else {
        this.message = data.message; // Return success message
        this._flashMessagesService.show(this.message, { cssClass: 'alert-success', timeout: 1500 });
        this.getAllProjects();
      }
    });
  }


  onDeleteClicked(id) {
    this.project_id = id;
    const dialogRef = this.dialog.open(DeleteProjectComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.response = result;
      this.changeDetectorRef.detectChanges();
      if (this.response) {
        //this.deleteProject();
        // Function for DELETE request
        this.projectService.deleteProject(this.project_id).subscribe(data => {
          // Check if delete request worked
          if (!data.success) {
            this.message = data.message; // Return error message
            this._flashMessagesService.show(this.message, { cssClass: 'alert-danger', timeout: 1500 });
          } else {
            this.message = data.message; // Return success message
            this._flashMessagesService.show(this.message, { cssClass: 'alert-success', timeout: 1500 });
            this.getAllProjects();
          }
        });
      }
    });


  }

}
