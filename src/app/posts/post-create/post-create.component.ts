import { Component, EventEmitter, Output } from "@angular/core";
import { NgForm } from "@angular/forms";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {

    enteredTitle: string = "";
    enteredContent: string = "";

    @Output() postCreated: EventEmitter<Post> = new EventEmitter<Post>();

    constructor(private postsService: PostsService) {}

    onAddPost(form: NgForm) {    
        console.log(form);  
        
        if(form.invalid)
            return;
        
        const post = {
            title: form.value.title,
            content: form.value.content
        };
        // this.newPost = "New user\'s Post";
        this.postsService.addPost(post.title, post.content);
        form.resetForm();
        return;
        // this.postCreated.emit(post);
    }

}

