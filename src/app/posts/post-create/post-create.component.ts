import { Component, EventEmitter, OnInit, Output, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {

    enteredTitle: string = "";
    enteredContent: string = "";

    private mode = "create";
    private postId: string;
    isLoading: boolean = false;

    post: Post = {
        title: "",
        content: "",
        creator: ""
    };

    @Output() postCreated: EventEmitter<Post> = new EventEmitter<Post>();

    private authStatusSub: Subscription;

    constructor(private postsService: PostsService, public route: ActivatedRoute, private authService: AuthService) {}

    ngOnInit(): void {

        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
            authStatus => {
                this.isLoading = false;
            }
        )

        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has("postId")) {
                this.mode = "edit";
                this.postId = paramMap.get("postId");
                this.isLoading = true;
                this.postsService.getPost(this.postId)
                .subscribe((response) => {
                    this.isLoading = false;
                    // this.post = response.post;
                    const post: Post = {
                        id: response.post._id,
                        title: response.post.title,
                        content: response.post.content,
                        creator: response.post.creator
                    };
                    this.post = post;
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
        this.isLoading = true;
        if(this.mode == "create")        
            this.postsService.addPost(post.title, post.content);
        else    
            this.postsService.updatePost(this.postId, post.title, post.content);
        form.resetForm();
        return;
        // this.postCreated.emit(post);
    }

    ngOnDestroy(): void {
        this.authStatusSub.unsubscribe();
    }

}

