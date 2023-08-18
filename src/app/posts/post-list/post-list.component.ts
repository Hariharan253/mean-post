import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';

import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  @Input() posts: Post[] = [];

  postSub: Subscription = new Subscription();

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.postSub = this.postsService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe(); 
  }




}
