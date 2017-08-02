import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { HttpModule } from '@angular/http';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';

import { MaterialModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import 'hammerjs';

import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectComponent } from './project/project.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './services/auth.service';
import { ProfileComponent } from './profile/profile.component';
import { EditProjectComponent } from './edit-project/edit-project.component';

// Our Array of Angular 2 Routes
const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent // Default Route
  },
  {
    path: 'register',
    component: RegisterComponent, // Register Route
    canActivate: [NotAuthGuard] // User must NOT be logged in to view this route
  },
  {
    path: 'login',
    component: LoginComponent, // Login Route
    canActivate: [NotAuthGuard] // User must NOT be logged in to view this route
  },
  {
    path: 'projects',
    component: ProjectsComponent, // Projects Route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'project',
    component: ProjectComponent, // Project Route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'edit-project',
    component: EditProjectComponent, // Edit Project Route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'profile',
    component: ProfileComponent, // Projects Route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  
  // {
  //   path: 'blog',
  //   component: BlogComponent, // Blog Route,
  //   //canActivate: [AuthGuard] // User must be logged in to view this route
  // },
  // {
  //   path: 'edit-blog/:id',
  //   component: EditBlogComponent, // Edit Blog Route
  //   //canActivate: [AuthGuard] // User must be logged in to view this route
  // },
  // {
  //   path: 'delete-blog/:id',
  //   component: DeleteBlogComponent, // Delete Blog Route
  //   //canActivate: [AuthGuard] // User must be logged in to view this route
  // },
  // {
  //   path: 'user/:username',
  //   component: PublicProfileComponent, // Public Profile Route
  //   canActivate: [AuthGuard] // User must be logged in to view this route
  //},
  { path: '**', component: HomeComponent } // "Catch-All" Route
];


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LoginComponent,
    HomeComponent,
    ProjectsComponent,
    ProjectComponent,
    RegisterComponent,
    ProfileComponent,
    EditProjectComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    FlashMessagesModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthService, AuthGuard, NotAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
