import React, { Component } from "react";

import Image from "../../../components/Image/Image";
import "./SinglePost.css";

class SinglePost extends Component {
  state = {
    title: "",
    author: "",
    date: "",
    image: "",
    content: "",
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;

    fetch(`http://localhost:8080/feed/posts/${postId}`)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData.posts[0]);
        this.setState({
          title: resData.posts[0].title,
          author: resData.posts[0].creator.name,
          image: `http://localhost:8080/${resData.posts[0].imageURL}`,
          date: resData.posts[0].createdAt,
          content: resData.posts[0].content,
        });
        console.log(this.state);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className='single-post'>
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className='single-post__image'>
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
