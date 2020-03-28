import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Post } from './post.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private storedPosts = new Subject<{ posts: Post[]; postsCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}
  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        environment.baseUrl + '/posts' + queryParams
      )
      .pipe(
        map(postsData => {
          return {
            posts: postsData.posts.map(
              (post: {
                title: string;
                content: string;
                _id: string;
                imagePath: string;
                creator: string;
              }) => {
                return {
                  title: post.title,
                  content: post.content,
                  id: post._id,
                  imagePath: post.imagePath,
                  creator: post.creator
                };
              }
            ),
            maxPosts: postsData.maxPosts
          };
        })
      )
      .subscribe(dataConverted => {
        this.posts = dataConverted.posts;
        console.log(dataConverted);

        this.storedPosts.next({
          posts: [...this.posts],
          postsCount: dataConverted.maxPosts
        });
      });
  }

  getPostById(postId: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creaotr: string;
    }>( environment.baseUrl + '/posts/' + postId);
  }

  getPostsSubject() {
    return this.storedPosts.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http
      .post<{ message: string; post: Post }>(
        environment.baseUrl + '/posts',
        postData
      )
      .subscribe(responseData => {
        // const post: Post = {
        //   id: responseData.post.id,
        //   title,
        //   content,
        //   imagePath: responseData.post.imagePath
        // };
        // this.posts.push(post);
        // this.storedPosts.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: any) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put( environment.baseUrl + '/posts/' + id, postData)
      .subscribe(response => {
        // const updatedPosts = [...this.posts];
        // const updatePostIndex = updatedPosts.findIndex(p => p.id === id);
        // const post: Post = {
        //   id,
        //   title,
        //   content,
        //   imagePath: ''
        // };
        // updatedPosts[updatePostIndex] = post;
        // this.posts = updatedPosts;
        // this.storedPosts.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postID: string) {
    return this.http.delete( environment.baseUrl + '/posts/' + postID);
  }
}
