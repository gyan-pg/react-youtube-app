import React, { useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { Container } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Fab } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import ReactPlayer from "react-player";

import { AiFillLike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";
import { IoLogoYoutube } from "react-icons/io";

const useStyles = makeStyles((theme) => ({
  title: {
    paddingLeft: theme.spacing(2),
  },
  delete: {
    margin: theme.spacing(2),
  },
  like: {
    paddingTop: theme.spacing(3),
  },
}));

const VideoDetail = () => {
  const classes = useStyles();
  const {
    selectedVideo,
    deleteVideo,
    incrementLike,
    incrementDislike,
  } = useContext(ApiContext);

  if(!selectedVideo)
    return (
      <div className="container">
        <button className="wait">
          <IoLogoYoutube />
        </button>
      </div>
    );
  
  return (
    <>
      <div className="wrapper">
        <ReactPlayer
          className="player"
          url={selectedVideo.video}
          width="100%"
          height="100%"
          playing// 自動で動画再生
          controls// 再生ボタン・停止ボタン表示
          disablePictureInPicture// スクリーンショット機能の無効化
          config={{ 
            file: {
              attributes: {
                controlsList: "nodownload",// ダウンロードの無効化
                disablePictureInPicture: true,
              },
            },
           }}
        />
      </div>
      <Grid container alignItems="center">
        <Grid item xs={10}>
          <Typography className={classes.title} variant="h6">
            {selectedVideo.title}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <button className="like" onClick={() => incrementLike()}>
           <AiFillLike />
           <Typography>{selectedVideo.like}</Typography>
          </button>
        </Grid>
        <Grid item xs={1}>
          <button className="like" onClick={() => incrementDislike()}>
           <AiFillDislike />
           <Typography>{selectedVideo.dislike}</Typography>
          </button>
        </Grid>
      </Grid>
      <Fab
        className={classes.delete}
        color="primary"
        aria-label="delete"
        onClick={() => deleteVideo()}
      >
        <Delete />
      </Fab>
    </>
  );

};

export default VideoDetail;
