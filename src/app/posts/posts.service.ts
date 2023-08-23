import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Post } from './post.model';
import {Subject, map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated: Subject<Post[]> = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map((item, index) => {
          return {
            id: item._id,
            title: item.title,
            content: item.content
          }
        })
      }))
      .subscribe((res: Post[]) => {
        this.posts = res;
        this.postsUpdated.next([...this.posts]);
      })
  }

  public getPost(id: string) {
    return this.http.get<{message: string, post: Post}>(`http://localhost:3000/api/posts/${id}`);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null,title, content};
    this.http.post<{message: string, postId: string}>("http://localhost:3000/api/posts", post)
    .subscribe((responseData) => {
        post.id = responseData.postId; //setting up Original ID for post

        this.posts.push(post);
        console.log(responseData.message);
        this.postsUpdated.next([...this.posts]);
    });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {id, title, content};
    this.http.put<{message: string, post: Post[]}>(`http://localhost:3000/api/posts/${id}`, post)
    .subscribe((response) => {
      // console.log(response.message);
      const updatedPosts = [...this.posts];
      const index = updatedPosts.findIndex((item) => item.id === id);
      updatedPosts[index] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    })
  }

  deletePost(postId: string) {
    this.http.delete<{message: string}>(`http://localhost:3000/api/posts/${postId}`)
      .subscribe((response) => {        
        this.posts = this.posts.filter(item => item.id !== postId);
        this.postsUpdated.next([...this.posts]);
      })
  }
}
