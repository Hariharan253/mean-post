import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PageEvent } from '@angular/material/paginator';

import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  @Input() posts: Post[] = [];

  postSub: Subscription = new Subscription();
  isLoading: boolean = false;

  authStatusSubs: Subscription;
  userIsAuthenticated = false;

  totalPosts: number = 0;  
  postPerPage: number = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;

  userId: string;

  constructor(private postsService: PostsService, private authService: AuthService) {}

  ngOnInit(): void {

    this.userId = this.authService.getUserId(); //get the current user's userId from auth service

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId(); //get the current user's userId from auth service whenever there is a change in state of the  authentication
    });


    this.isLoading = true;

    this.postsService.getPosts(this.postPerPage, this.currentPage);
    this.postSub = this.postsService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[], postCount: number}) => {
      // console.log("Because I'm Subscribed");
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
      this.isLoading = false;
      
    });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postPerPage, this.currentPage);
    }); 
  }

  onChangedPage(pageData: PageEvent) {
    // console.log(pageData);
    this.isLoading = true;
    this.postPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
  }  

  ngOnDestroy(): void {
    this.isLoading = true;
    this.postSub.unsubscribe(); 
    this.authStatusSubs.unsubscribe();
  }




}
