import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostService } from "../posts.service";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-posts-list",
  templateUrl: "./posts-list.component.html",
  styleUrls: ["./posts-list.component.css"]
})
export class PostsListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isUserAuthenticated = false;
  isAuthSub: Subscription;
  postsSub: Subscription;

  constructor(
    public postsService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = true;
    this.postsSub = this.postsService.getPostsSubject().subscribe(postsData => {
      this.isLoading = false;
      this.totalPosts = postsData.postsCount;
      this.posts = postsData.posts;
    });
    this.isUserAuthenticated = this.authService.getIsUserAutheticated();
    this.isAuthSub = this.authService.getStatusListener().subscribe(isAuth => {
      this.isUserAuthenticated = isAuth;
    });
  }

  onDeletePost(postID: string) {
    this.isLoading = true;
    this.postsService.deletePost(postID).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangedPage(event: PageEvent) {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.postsPerPage = event.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
