import React, { Component } from "react";
import Header from "../../common/Header"
import "./Home.css";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import profileImg from "../../assets/images/upgrad.svg";

const useStyles = (theme) => ({
  media: {
    height: 150,
    paddingTop: "56.25%", // 16:9,
  },
});

class Home extends Component {
  constructor() {
    super();
    this.state = {
      profilePic: profileImg,
      endpoint1: [],
      postListForSearch: [],
      postList: [],
      likeIcon: "dispBlock",
      likedIcon: "dispNone",
      comment: "",
    };
  }

  // Invoking APIs when component mounts
  componentDidMount() {
    let data = null;
    let xhr = new XMLHttpRequest();
    let that = this;
    let accessToken = window.sessionStorage.getItem("access-token");
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        that.setState({
          endpoint1: JSON.parse(this.responseText).data,
        });
        //Calling 2nd API only if we get response from 1st API
        that.state.endpoint1 &&
          that.state.endpoint1.map((info) => {
            return that.getImages(info);
          });
      }
    });

    // https://graph.instagram.com/me/media?fields=id,caption&access_token=YourAccessToken

    xhr.open(
      "GET",
      this.props.baseUrl +
        "me/media?fields=id,caption&access_token=" +
        accessToken
    );
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
  }

  getImages(info) {
    let data = null;
    let xhr = new XMLHttpRequest();
    let that = this;
    let accessToken = window.sessionStorage.getItem("access-token");
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        let parsedData = JSON.parse(this.responseText);
        let newStateArray;
        let post = {};
        post.id = parsedData.id;
        post.caption = info.caption || "This is default caption";
        post.media_url = parsedData.media_url;
        post.profilePic = that.state.profilePic;
        post.username = parsedData.username;
        post.likeIcon = "dispBlock";
        post.likedIcon = "dispNone";
        post.likesCount = Math.floor(Math.random() * 10);
        post.clear = "";
        post.tags = post.caption.match(/#\S+/g);
        post.commentContent = [];
        post.timestamp = new Date(parsedData.timestamp);
        newStateArray = that.state.postList.slice();
        newStateArray.push(post);
        that.setState({
          postList: newStateArray,
          postListForSearch: newStateArray,
        });
      }
    });

    //graph.instagram.com/17895695668004550?fields=id,media_type,media_url,username,timestamp&access_token=YourAccessToken
    xhr.open(
      "GET",
      this.props.baseUrl +
        info.id +
        "?fields=id,media_type,media_url,username,timestamp&access_token=" +
        accessToken
    );
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
  }

  // function for displaying the filtered post
  filteredPostHandler = (filteredPost) => {
    this.setState({ postList: filteredPost });
  };

  //function to add a like to a post
  likeClickHandler = (id) => {
    let postList = this.state.postList;
    postList.forEach(function (post) {
      // if the post id equal to the liked post id then display
      // the likedIcon, hide the likeIcon, and increment like count by 1
      if (post.id === id) {
        post.likesCount += 1;
        post.likeIcon = "dispNone";
        post.likedIcon = "dispBlock";
        this.setState({
          likeIcon: "dispNone",
          likedIcon: "dispBlock",
        });
      }
    }, this);
  };

  //function to unlike a post
  likedClickHandler = (id) => {
    let postList = this.state.postList;
    postList.forEach(function (post) {
      // if the post id equal to the liked post id then display the likeIcon,
      // hide the likedIcon, and decrement like count by 1
      if (post.id === id) {
        post.likesCount -= 1;
        post.likeIcon = "dispBlock";
        post.likedIcon = "dispNone";
        this.setState({
          likeIcon: "dispBlock",
          likedIcon: "dispNone",
        });
      }
    }, this);
  };

  commentChangeHandler = (e, id) => {
    this.setState({ comment: e.target.value });
    let postList = this.state.postList;
    postList.forEach(function (post) {
      if (post.id === id) {
        post.clear = e.target.value;
      }
    }, this);
  };

  addCommentHandler = (id) => {
    if (this.state.comment === "") {
      alert("Cannot add Empty comment");
    } else {
      let postList = this.state.postList;
      postList.forEach(function (post) {
        //if the post id is equal to the commented post id, then add the comment in the commentContent array
        if (post.id === id) {
          post.commentContent.push(this.state.comment);
          this.setState({ comment: "" });
          post.clear = "";
        }
      }, this);
    }
  };

  getPostDate = (timestamp) => {
    const dd = ("0" + timestamp.getDate()).slice(-2),
      mm = ("0" + (timestamp.getMonth() + 1)).slice(-2);
    return (
      dd +
      "/" +
      mm +
      "/" +
      timestamp.getFullYear() +
      " " +
      timestamp.getHours() +
      ":" +
      timestamp.getMinutes() +
      ":" +
      timestamp.getSeconds()
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        {/* display the contents only if the user is logged in */}
        {sessionStorage.getItem("access-token") !== null ? (
          <div>
            <Header
              home="true"
              profilePic={this.state.profilePic}
              baseUrl={this.props.baseUrl}
              list={this.state.postListForSearch}
              callbackFromHome={this.filteredPostHandler}
              history={this.props.history}
            />
            <div className="container">
              {this.state.postList.map((post) => (
                <Card className="cards-layout" key={"post" + post.id}>
                  <div className="posts">
                    <CardHeader
                      avatar={<Avatar src={post.profilePic} alt="pic" />}
                      title={post.username}
                      // subheader="03/10/2018 16:07:24"
                      subheader={this.getPostDate(post.timestamp)}
                    />
                    <CardContent>
                      <CardMedia
                        className={classes.media}
                        image={post.media_url}
                      />
                      <hr />
                      <Typography variant="body2" color="inherit" component="p">
                        {post.caption}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ color: "blue" }}
                        display="inline"
                      >
                        {post.tags &&
                          post.tags.map((value, key) => {
                            return (
                              <span
                                key={"tag" + key}
                                style={{ marginRight: 5 }}
                              >
                                {" "}
                                {value}{" "}
                              </span>
                            );
                          })}
                      </Typography>
                      <CardActions disableSpacing>
                        <div className="likes">
                          <div
                            className={post.likeIcon}
                            onClick={() => this.likeClickHandler(post.id)}
                          >
                            <FavoriteBorderIcon />
                          </div>
                          <div className={post.likedIcon}>
                            <FavoriteIcon
                              style={{ color: "red" }}
                              onClick={() => this.likedClickHandler(post.id)}
                            />
                          </div>
                          <span style={{ marginLeft: 10, marginBottom: 8 }}>
                            {post.likesCount < 2 ? (
                              <div> {post.likesCount} like </div>
                            ) : (
                              <div> {post.likesCount} likes </div>
                            )}
                          </span>
                        </div>
                      </CardActions>
                      <div className="comments-section">
                        {post.commentContent.map((value, key) => (
                          <CardActions>
                            <div key={"comment" + key}>
                              <Typography
                                variant="body2"
                                color="inherit"
                                component="span"
                                style={{ fontWeight: "bold" }}
                              >
                                {post.username}:{" "}
                              </Typography>
                              {value}
                            </div>
                          </CardActions>
                        ))}
                      </div>
                      <br />
                      <div className="comments">
                        <FormControl className="control">
                          <InputLabel htmlFor="comment">
                            Add a comment
                          </InputLabel>
                          <Input
                            comment={this.state.comment}
                            onChange={(e) =>
                              this.commentChangeHandler(e, post.id)
                            }
                            value={post.clear}
                          />
                        </FormControl>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ marginLeft: 20 }}
                          onClick={() => this.addCommentHandler(post.id)}
                        >
                          ADD
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          this.props.history.push("/")
        )}
      </div>
    );
  }
}

export default withStyles(useStyles)(Home);
