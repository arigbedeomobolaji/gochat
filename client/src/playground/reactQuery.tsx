// import React from "react";
// import { useInfiniteQuery, useQuery } from "react-query";
// import axios from "axios";

// const retrievePosts = async () => {
//   const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
//   return response.data;
// };

// const DisplayPosts = () => {
    // postsData is used as an identifier for the cache
//   const { data: posts, error, isLoading } = useQuery("postsData", retrievePosts);

//   if (isLoading) return <div>Fetching posts...</div>;
//   if (error) return <div>An error occurred: {error.message}</div>;

//   return (
//     <ul>
//       {posts.map((post) => (
//         <li key={post.id}>{post.title}</li>
//       ))}
//     </ul>
//   );
// };

// export default DisplayPosts;


// Mutating Data
// import React, { useState } from "react";
// import { useMutation } from "react-query";
// import axios from "axios";

// const CreatePost = () => {
//   const [title, setTitle] = useState("");
//   const [body, setBody] = useState("");

//   const mutation = useMutation((newPost) => axios.post("https://jsonplaceholder.typicode.com/posts", newPost));

//   const submitData = () => {
//     mutation.mutate({ title, body });
//   };

//   if (mutation.isLoading) {
//     return <span>Submitting...</span>;
//   }

//   if (mutation.isError) {
//     return <span>Error: {mutation.error.message}</span>;
//   }

//   if (mutation.isSuccess) {
//     return <span>Post submitted!</span>;
//   }

//   return (
//     <div>
//       <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
//       <input type="text" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
//       <button onClick={submitData}>Submit</button>
//     </div>
//   );
// };
// export default CreatePost;

// Update post
// import React, { useState } from "react";
// import { useMutation } from "react-query";
// import axios from "axios";

// const UpdatePost = () => {
//   const [title, setTitle] = useState("");
//   const [body, setBody] = useState("");

//   const mutation = useMutation((updatedPost) => axios.put("https://jsonplaceholder.typicode.com/posts/1", updatedPost));

//   const submitData = () => {
//     mutation.mutate({ title, body });
//   };

//   if (mutation.isLoading) {
//     return <span>Updating...</span>;
//   }

//   if (mutation.isError) {
//     return <span>Error: {mutation.error.message}</span>;
//   }

//   if (mutation.isSuccess) {
//     return <span>Post updated!</span>;
//   }

//   return (
//     <div>
//       <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
//       <input type="text" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
//       <button onClick={submitData}>Update</button>
//     </div>
//   );
// };

// export default UpdatePost;

// Delete operation
// import React from "react";
// import { useMutation } from "react-query";
// import axios from "axios";

// const DeletePost = () => {
//   const mutation = useMutation(() => axios.delete("https://jsonplaceholder.typicode.com/posts/1"));

//   const deleteData = () => {
//     mutation.mutate();
//   };

//   if (mutation.isLoading) {
//     return <span>Deleting...</span>;
//   }

//   if (mutation.isError) {
//     return <span>Error: {mutation.error.message}</span>;
//   }

//   if (mutation.isSuccess) {
//     return <span>Post deleted!</span>;
//   }

//   return (
//     <div>
//       <button onClick={deleteData}>Delete Post</button>
//     </div>
//   );
// };

// export default DeletePost;


// import { useQueryClient } from "react-query";
// import { keepPreviousData } from "@tanstack/react-query";

// const queryClient = useQueryClient();

// means a refresh will occur for that query key
// queryClient.invalidateQueries("name of query you wish to invalidates")

// query keys structure
// /posts   => ["  posts"]
// posts/1  => ["posts", post.id]
// posts?authorId=1 => ["posts", {authorId:1 }]
// posts/2/comments => ["posts", post.id, "comments"]


// useQuery Structure
// const postQuery = useQuery({
    // Uniquely identify 
//     queryKey: ["posts"],
    // This handles data fetching and mutation as it's
    // It takes a object which is all the properties 
    // where the queryKey is not excluded. 
//     queryFn: (obj) => {}
// });

// When you are refetching data your query will be in the loading state. When fetching is already done it will be in the idle status and if it is in the process of fetching and he lose internet connectivity it will be in the pause status.

// if you want to run a function after a func has completely loaded then on the func that is depending on another function set enable to either true or false.

// const postQuery = useQuery({
//     queryKey: ['posts', id],
//     queryFn: () => getPost(id) 
// });

// const userQuery = useQuery({
//     queryKey: ["users", postQuery?.data?.userId],
//     enabled: postQuery?.data?.userId != null,
//     queryFn: () => getUser(postQuery?.data?.userId)
// })

// // Creating mutation
// const createPostMutation = useMutation({
//     mutationFn: createPost,
// });

// function handleSubmit(e) {
//     e.preventDefault();
//     createPostMutation.mutate({
//         title: "title",
//         body: "body"
//     })
// }




// Mutation
// const createPostMutation = useMutation({
    // What the createPostMutation will be doing
//     mutationFn: CreatePost,
    // retry three times but i won't do it with  mutation
//     retry: 3,
    // What it wil be doing if successfull (promise resolves)
//     onSuccess: (data, variables, contaxt) => {
    //    Logs the return value of onMutate function
//         console.log(context)
//     },
//     onMutate: variables => {
//         return { hi: "Bye"}
//     }
// })

// This let you send the createPostMutation to the backend
// createPostMutation.mutate()

// if you need to do anything with the createPostMutation data you can use
// createPostMutation.mutateAsync()''

// putting mutate data into cache
// It creates a new query in my cache thats is pointing to the posts queryKey with the specified data.id then allows me to add a newPost to the query

// queryClient.setQueryData(["posts", data.id], newPost)
// to make sure invalidation occurs that's data when updated issues refetch queries as in Apollo Client we use
// exact: true make sure that only queries that matches is been refetched.
// queryClient.inValidateQueries["posts"], {exact: true}


// When working with pagination in react query we use
// use property ==> keepPreviousData: true to make sure the provious data still shows when the page is loading


// infinite scroll => useInfiniteQuery()
// useInfiniteQuery({
//     queryKey: ["posts", "infinite"],
//     getNextPageParam: prevData => prevData.nextPage,
//     queryFn: ((pageParam = 1)) => getPostsPaginated(pageParam)
// })


// useQueries => to run more than one queries at a time

// prefectching a data => as the name implies.
// initialData: let you set initial data
