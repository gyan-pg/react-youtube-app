import React, { useReducer } from "react";
import { withCookies } from "react-cookie";
import axios from "axios";
import { makeStyles } from "@material-ui/core";
import { Avatar } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { Typography } from "@material-ui/core";
import { Container } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import { START_FETCH, FETCH_SUCCESS, ERROR_CATCHED, INPUT_EDIT, TOGGLE_MODE } from "./actionTypes";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3),
  },
  span: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'teal',
  },
  spanError: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'fuchsia',
    marginTop: 10,
  },
}));

const initialState = {
  isLoading: false,
  isLoginView: true,
  error: '',
  credentialsLog: {
    email: '',
    password: ''
  },
};

const loginReducer = (state, action) => {
  switch (action.type) {
    case START_FETCH: {
      return{
        ...state,// stateの中身を全部展開。
        isLoading: true,// 必要な箇所のみ上書きする。
      };
    }
    case FETCH_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case ERROR_CATCHED: {
      return {
        ...state,
        error: 'Email or password is not correct!',
        isLoading: false,
      };
    }
    case INPUT_EDIT: {
      return {
        ...state,
        [action.inputName]: action.payload,
        error: '',
      };
    }
    case TOGGLE_MODE: {
      return {
        ...state,
        isLoginView: !state.isLoginView,
      };
    }
    default: 
      return state;
  }
}

// cookieProviderから渡されるcookieの情報を受け取るために、
// propsを準備
const Login = (props) => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(loginReducer, initialState);

  const inputChangedLog = (e) => {
    const cred = state.credentialsLog;
    cred[e.target.name] = e.target.value;
    dispatch({
      type: INPUT_EDIT,
      inputName: 'state.credentialLog',
      payload: cred,
    })
  };

  const login = async (e) => {
    e.preventDefault();
    if(state.isLoginView) {
      // ログイン時の処理
      try{
        dispatch({type: START_FETCH});
        // jwt tokenを入手するための通信
        const res = await axios.post('http://127.0.0.1:8000/authen/jwt/create/',
          state.credentialsLog, 
          { headers: { 'Content-Type': 'application/json' } }
        );
        // jwt-tokenという変数に上でとってきたjwt tokenを格納している。
        props.cookies.set('jwt-token', res.data.access);
        // res.data.accessがある=ログイン成功ということ。
        res.data.access ? window.location.href = "/youtube" : window.location.href = "/";
        dispatch({type: FETCH_SUCCESS});
      } catch {
        dispatch({type: ERROR_CATCHED});
      }
    } else {
      // ユーザー登録の処理
      try {
        dispatch({type: START_FETCH});
        // ユーザー登録用のアドレスに情報を送っている。
        await axios.post('http://127.0.0.1:8000/api/create/',
          state.credentialsLog,
          { headers: { 'Content-Type': 'application/json' } }
        );
        // 続けてログインの処理
        const res = await axios.post('http://127.0.0.1:8000/authen/jwt/create/',
          state.credentialsLog, 
          { headers: { 'Content-Type': 'application/json' } }
        );
        props.cookies.set('jwt-token', res.data.access);
        res.data.access ? window.location.href = "/youtube" : window.location.href = "/";
        dispatch({type: FETCH_SUCCESS});
      } catch {
        dispatch({type: ERROR_CATCHED});
      }
    }
  }

  const toggleView = () => {
    dispatch({type: TOGGLE_MODE});
  }

  return (
    <Container maxWidth="xs">
      <form onSubmit={login}>
        <div className={classes.paper}>
          {state.isLoading && <CircularProgress />}
          <Avatar className={classes.avatar}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">
            {state.isLoginView ? 'Login' : 'Register'}
          </Typography>

          <TextField
                  variant="outlined" margin="normal"
                  fullWidth label="Email"
                  name="email"
                  value={state.credentialsLog.email}
                  onChange={inputChangedLog}
                  autoFocus
          />

          <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  value={state.credentialsLog.password}
                  onChange={inputChangedLog}
                  type="password"
          />

          <span className={classes.spanError}>{state.error}</span>

          { state.isLoginView ?
              !state.credentialsLog.password || !state.credentialsLog.email ?
              <Button className={classes.submit} type="submit" fullWidth disabled
                variant="contained" color="primary">Login</Button>
              : <Button className={classes.submit} type="submit" fullWidth
                variant="contained" color="primary">Login</Button>
            :
              !state.credentialsLog.password || !state.credentialsLog.email ?
              <Button className={classes.submit} type="submit" fullWidth disabled
                variant="contained" color="primary">Register</Button>
              : <Button className={classes.submit} type="submit" fullWidth
                variant="contained" color="primary">Register</Button>
          }

          <span onClick={() => toggleView()} className={classes.span}>
            {state.isLoginView ? 'Create Account' : 'Back to login'}
          </span>

        </div>
      </form>
    </Container>
  )
};

export default withCookies(Login);
