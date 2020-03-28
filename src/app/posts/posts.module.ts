import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PostsCreateComponent } from './posts-create/posts-create.component';
import { PostsListComponent } from './posts-list/posts-list.component';
import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
  declarations: [
    PostsCreateComponent,
    PostsListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class PostsModule {}
