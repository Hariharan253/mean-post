import { Component } from '@angular/core';

import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mean-profile';

  recordedPosts: Post[] = [];

  onPostAdded(post: Post) {
    this.recordedPosts.push(post);
  }
}
