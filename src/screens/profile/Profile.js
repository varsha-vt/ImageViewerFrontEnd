import React, { Component } from "react";
import Header from "../../common/Header"
import profileImg from "../../assets/images/icon.svg";
import "./Profile.css";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";
import Modal from "@material-ui/core/Modal";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Avatar from "@material-ui/core/Avatar";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = (theme) => ({
  paper: {
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: "20px",
    outline: "none",
    borderRadius: "5px",
    borderColor: "gray",
    borderStyle: "solid",
  },

  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: "95%",
    height: 750,
    cursor: "pointer",
    overflow: "hidden",
  },
});

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      profilePic: profileImg,
      endpoint1: [],
      username: "",
      totalPostCount: 0,
      NumOfUsersFollowed: Math.floor(Math.random() * 100),
      NumOfFollowers: Math.floor(Math.random() * 100),
      fullName: "Varsha Thomas",
      editModal: false,
      nameRequired: "dispNone",
      name: "",
      postList: [],
      postModal: false,
      imageUrl: "",
      caption: "",
      tags: [],
      postComments: [],
      likeIcon: "",
      likedIcon: "",
      likesCount: 0,
      postId: 0,
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
        that.setState({
          totalPostCount: that.state.endpoint1 && that.state.endpoint1.length,
        });
        //Calling 2nd API only if we get response from 1st API
        that.state.endpoint1 &&
          that.state.endpoint1.map((info) => {
            return that.getImages(info);
          });
      }
    });

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
        post.postComments = [];
        post.timestamp = new Date(parsedData.timestamp);
        newStateArray = that.state.postList.slice();
        newStateArray.push(post);
        that.setState({
          postList: newStateArray,
        });
      }
    });

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

  editModalHandler = () => {
    this.setState({ editModal: true, nameRequired: "dispNone", name: "" });
  };

  modalCloseHandler = () => {
    this.setState({ editModal: false, nameRequired: "dispNone" });
  };

  //function to handle the input change event
  inputNameChangeHandler = (e) => {
    this.setState({ name: e.target.value });
  };

  //function to edit the name of the user
  editNameHandler = () => {
    //if the input field is empty display the required message or else set fullname of the user and close the modal
    this.state.name === ""
      ? this.setState({ nameRequired: "dispBlock" })
      : this.setState({ fullName: this.state.name, editModal: false });
  };

  postModalCloseHandler = () => {
    this.setState({ postModal: false });
  };

  postModalOpenHandler = (postId) => {
    this.setState({ postModal: true });
    //filter the post according to the id and display it
    let clickedPost = this.state.postList.filter((post) => {
      return post.id === postId;
    })[0];

    this.setState({
      imageUrl: clickedPost.media_url,
      username: clickedPost.username,
      caption: clickedPost.caption,
      tags: clickedPost.caption.match(/#\S+/g),
      likeIcon: clickedPost.likeIcon,
      likedIcon: clickedPost.likedIcon,
      likesCount: clickedPost.likesCount,
      postId: clickedPost.id,
      postComments: clickedPost.postComments,
    });
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
          likesCount: post.likesCount,
        });
      }
    }, this);
  };

  //function to unlike a post
  likedClickHandler = (id) => {
    let postList = this.state.postList;
    postList.forEach(function (post) {
      // if the post id equal to the liked post id then display the likeIcon, hide the likedIcon, and decrement like count by 1
      if (post.id === id) {
        post.likesCount -= 1;
        post.likeIcon = "dispBlock";
        post.likedIcon = "dispNone";
        this.setState({
          likeIcon: "dispBlock",
          likedIcon: "dispNone",
          likesCount: post.likesCount,
        });
      }
    }, this);
  };

  addCommentHandler = (id) => {
    if (this.state.comment === "") {
      alert("Cannot add Empty comment");
    } else {
      let postList = this.state.postList;
      postList.forEach(function (post) {
        //if the post id is equal to the commented post id, then add the comment in the postComments array
        if (post.id === id) {
          post.postComments.push(this.state.comment);
          this.setState({
            comment: "",
            postComments: post.postComments,
          });
          post.clear = "";
        }
      }, this);
    }
  };

  //function to handle the input change event
  commentChangeHandler = (e) => {
    this.setState({ comment: e.target.value });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        {sessionStorage.getItem("access-token") !== null ? (
          <div>
            <Header
              profile="true"
              profilePic={this.state.profilePic}
              baseUrl={this.props.baseUrl}
              history={this.props.history}
            />
            <div className="profile-container">
              <div className="profile-header">
                <img
                  className="header-image"
                  src={this.state.profilePic}
                  alt={this.state.username}
                />
                <div className="header-content">
                  <Typography variant="h5" component="h1">
                    {this.state.username}
                  </Typography>
                  <div className="profile-header-row2">
                    <Typography
                      variant="body1"
                      component="h1"
                      style={{ marginRight: "80px" }}
                    >
                      Posts: {this.state.totalPostCount}
                    </Typography>
                    <div>
                      <Typography
                        variant="body1"
                        component="h1"
                        style={{ marginRight: "80px" }}
                      >
                        Follows: {this.state.NumOfUsersFollowed}
                      </Typography>
                    </div>
                    <Typography variant="body1" component="h1">
                      Followed By: {this.state.NumOfFollowers}
                    </Typography>
                  </div>
                  <div className="profile-header-row3">
                    <Typography
                      variant="h6"
                      component="h1"
                      style={{ marginRight: "20px" }}
                    >
                      {this.state.fullName}
                    </Typography>
                    <Fab
                      color="secondary"
                      aria-label="edit"
                      onClick={this.editModalHandler}
                    >
                      <EditIcon />
                    </Fab>
                  </div>
                </div>
                <Modal
                  open={this.state.editModal}
                  onClose={this.modalCloseHandler}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                >
                  <div style={getModalStyle()} className={classes.paper}>
                    <Typography
                      variant="h5"
                      component="h1"
                      style={{ marginBottom: "25px" }}
                    >
                      Edit
                    </Typography>
                    <FormControl required>
                      <InputLabel htmlFor="name">Full Name</InputLabel>
                      <Input
                        id="name"
                        type="text"
                        name={this.state.name}
                        onChange={this.inputNameChangeHandler}
                      />
                      <FormHelperText className={this.state.nameRequired}>
                        <span className="red">required</span>
                      </FormHelperText>
                    </FormControl>
                    <br />
                    <br />
                    <br />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.editNameHandler}
                    >
                      Update
                    </Button>
                  </div>
                </Modal>
              </div>
              <div className="body-content">
                <div className={classes.root}>
                  {/* display all the user post images */}
                  <GridList
                    cellHeight={400}
                    className={classes.gridList}
                    cols={3}
                  >
                    {this.state.postList.map((post) => (
                      <GridListTile
                        key={"grid" + post.id}
                        onClick={() => this.postModalOpenHandler(post.id)}
                      >
                        <img src={post.media_url} alt={this.state.username} />
                      </GridListTile>
                    ))}
                  </GridList>
                </div>
                <Modal
                  open={this.state.postModal}
                  onClose={this.postModalCloseHandler}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                >
                  <div style={getModalStyle()} className={classes.paper}>
                    <div className="post-modal-container">
                      <div className="post-modal-image-container">
                        <img
                          src={this.state.imageUrl}
                          alt={this.state.username}
                          height="90%"
                          width="100%"
                        ></img>
                      </div>
                      <div>
                        <div className="post-modal-header">
                          <Avatar aria-label="recipe" className="avatar">
                            <img
                              src={this.state.profilePic}
                              alt={this.state.username}
                              className="post-modal-avatar-img"
                            />
                          </Avatar>
                          <Typography
                            variant="body1"
                            component="p"
                            style={{ marginLeft: "20px" }}
                          >
                            {this.state.username}
                          </Typography>
                        </div>
                        <hr />
                        <Typography variant="body1" component="p">
                          {this.state.caption}
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{ color: "blue" }}
                          display="inline"
                        >
                          {this.state.tags &&
                            this.state.tags.map((value, key) => {
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
                        <div className="post-modal-comments-section">
                          {this.state.postComments.map((value, key) => {
                            return (
                              <span key={"comment" + key}>
                                <span style={{ fontWeight: "bold" }}>
                                  {this.state.username}:{" "}
                                </span>
                                {value}
                              </span>
                            );
                          })}
                        </div>
                        <div className="post-modal-likes">
                          <div
                            className={this.state.likeIcon}
                            onClick={() =>
                              this.likeClickHandler(this.state.postId)
                            }
                          >
                            <FavoriteBorderIcon />
                          </div>
                          <div className={this.state.likedIcon}>
                            <FavoriteIcon
                              style={{ color: "red" }}
                              onClick={() =>
                                this.likedClickHandler(this.state.postId)
                              }
                            />
                          </div>
                          <span style={{ marginLeft: 10, marginBottom: 8 }}>
                            {this.state.likesCount < 2 ? (
                              <div>{this.state.likesCount} like </div>
                            ) : (
                              <div>{this.state.likesCount} likes</div>
                            )}
                          </span>
                        </div>
                        <div className="post-modal-comments">
                          <FormControl className="post-modal-control">
                            <InputLabel htmlFor="comment">
                              Add a comment
                            </InputLabel>
                            <Input
                              comment={this.state.comment}
                              onChange={this.commentChangeHandler}
                              value={this.state.comment}
                            />
                          </FormControl>
                          <Button
                            variant="contained"
                            color="primary"
                            style={{ marginLeft: 20 }}
                            onClick={() =>
                              this.addCommentHandler(this.state.postId)
                            }
                          >
                            ADD
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Profile);
