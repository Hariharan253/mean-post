import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Post } from './post.model';
import {Subject, map} from "rxjs";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor
  (
    private http: HttpClient,
    private router: Router
  ) { }

  getPosts(postsPerPage: number, currentPage: number) {

    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    this.http.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map((postData) => {
        return {"posts": postData.posts.map((item, index) => {
          return {
            id: item._id,
            title: item.title,
            content: item.content,
            creator: item.creator
          }
        }),
        "maxPosts": postData.maxPosts
      }
      }))
      .subscribe((res: {posts: Post[], maxPosts: number}) => {
        console.log("Creator:", res);
        this.posts = res.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: res.maxPosts});
      })
  }

  public getPost(id: string) {
    return this.http.get<{message: string, post: any}>(`http://localhost:3000/api/posts/${id}`);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null,title, content, creator: null};
    this.http.post<{message: string, postId: string}>("http://localhost:3000/api/posts", post)
    .subscribe((responseData) => {
        post.id = responseData.postId; //setting up Original ID for post

        this.posts.push(post);
        // console.log(responseData.message);
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
    });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {id, title, content, creator: null};
    this.http.put<{message: string, post: Post[]}>(`http://localhost:3000/api/posts/${id}`, post)
    .subscribe((response) => {
      // console.log(response.message);
      const updatedPosts = [...this.posts];
      const index = updatedPosts.findIndex((item) => item.id === id);
      updatedPosts[index] = post;
      this.posts = updatedPosts;
      // this.postsUpdated.next([...this.posts]);

      this.router.navigate(["/"]);
    })
  }

  deletePost(postId: string) {
    return this.http.delete<{message: string}>(`http://localhost:3000/api/posts/${postId}`);      
  }
}
