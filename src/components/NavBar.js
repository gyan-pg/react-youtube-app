import React from "react";
import { withCookies } from "react-cookie";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar } from "@material-ui/core";
import { Toolbar } from "@material-ui/core";
import { Typography } from "@material-ui/core";

import { FiLogOut } from 'react-icons/fi';
import { FaYoutube } from 'react-icons/fa';


const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
}));


// cookieProviderから渡されるcookieの情報を受け取るために、
// propsを準備
const NavBar = (props) => {

  const classes = useStyles();

  const Logout = () => {
    // logoutが押された際は、jwt-tokenの値を削除して、
    // ログイン画面に飛ばす。
    props.cookies.remove('jwt-token');
    window.location.href = '/';
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <button className="logo">
          <FaYoutube />
        </button>
        <Typography variant="h5" className={classes.title}>Youtube App</Typography>

        <button className="logout" onClick={Logout}>
          <FiLogOut/>
        </button>

      </Toolbar>
    </AppBar>
  )
};
// withCookiesを使用する際は、
// exportするコンポーネントを囲う。
export default withCookies(NavBar);