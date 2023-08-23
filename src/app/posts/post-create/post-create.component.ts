import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { NgForm } from "@angular/forms";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

    enteredTitle: string = "";
    enteredContent: string = "";

    private mode = "create";
    private postId: string;

    post: Post = {
        title: "",
        content: ""
    };

    @Output() postCreated: EventEmitter<Post> = new EventEmitter<Post>();

    constructor(private postsService: PostsService, public route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has("postId")) {
                this.mode = "edit";
                this.postId = paramMap.get("postId");

                this.postsService.getPost(this.postId)
                .subscribe((response) => {
                    this.post = response.post;
                })
            }                
            else {
                this.mode = "create";
                this.postId = null;
            }
        });
    }

    onSavePost(form: NgForm) {    
        console.log(form);  
        
        if(form.invalid)
            return;
        
        const post = {
            title: form.value.title,
            content: form.value.content
        };
        // this.newPost = "New user\'s Post";
        if(this.mode == "create")        
            this.postsService.addPost(post.title, post.content);
        else    
            this.postsService.updatePost(this.postId, post.title, post.content);
        form.resetForm();
        return;
        // this.postCreated.emit(post);
    }

}

