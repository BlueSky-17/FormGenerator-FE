import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
// import Link from '@mui/material/Link';
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import logo from "../../assets/logo.png";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

import CircleIcon from "@mui/icons-material/Circle";
import Icon from "@mui/material/Icon";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { sign } from "crypto";
import Alert from '@mui/material/Alert';
import { Console } from "console";

export default function SignUpSide({ setToken }) {
  const [signInStatus, setSignInStatus] = useState<string>("");
  const [render, setRender] = useState(false);
  const nav: any = useNavigate();



  const HandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    async function signUpHandle(data) {
      try {
        var newUser = {
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          username: data.get("username"),
          email: data.get("email"),
          password: data.get("password"),
        };
        const response = await fetch(process.env.REACT_APP_ROOT_URL + "signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });

        if (response.status === 200) {
          return response.json();
        } else if (
          response.status === 400 ||
          response.status === 500 ||
          response.status === 409
        ) {
          const errorData = await response.json();
          setSignInStatus(errorData.message);
        }
      } catch (error) {
        console.log(error);
      }
    }

    try {
      console.log(data);
      const token = await signUpHandle(data);
      setToken(token);
      if (token !== undefined) nav("/myforms");
    } catch (error) {
      console.log(error);
    }
  };

  const [inputValue, setInputValue] = React.useState('');
  const handleChangeInputValue = (e) => {
    setInputValue(e.target.value);
  };
  const [firstNameError, setFirstNameError] = React.useState('');
  const [lastNameError, setLastNameError] = React.useState('');
  const [usernameError, setUsernameError] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [rePasswordError, setRePasswordError] = React.useState('');
  const [password, setPassword] = React.useState('');
  //Get value of textField after onBlur the field

  const saveInputValue = (field: string) => (e) => {
    //Return error if active textField but don't fill
    if (inputValue === '') {
      switch (field) {
        case 'firstName':
          {
            setFirstNameError('Vui lòng nhập tên');
            break;
          }
        case 'lastName':
          {
            setLastNameError('Vui lòng nhập họ và tên lót');
            break;
          }
        case 'username':
          {
            setUsernameError('Vui lòng nhập tên đăng nhập');
            break;
          }
        case 'email':
          {
            setEmailError('Vui lòng nhập email');
            break;
          }
        case 'password':
          {
            setPasswordError('Vui lòng nhập mật khẩu');
            setRePasswordError('');
            break;
          }
        case 'rePassword':
          {
            if (password)
              setRePasswordError('Vui lòng xác nhận lại mật khẩu');
            else {
              setRePasswordError('');
            }
            break;
          }
        default:
          break;
      }
    }
    else {
      switch (field) {
        case 'firstName':
          {
            setFirstNameError('');
            break;
          }
        case 'lastName':
          {
            setLastNameError('');
            break;
          }
        case 'username':
          {
            setUsernameError('');
            break;
          }
        case 'email':
          {
            setEmailError('');
            break;
          }
        case 'password':
          {
            setPasswordError('');
            setPassword(inputValue);
            break;
          }
        case 'rePassword':
          {
            if (password !== inputValue) {
              setRePasswordError('Mật khẩu không khớp')
            }
            else {
              setRePasswordError('');
            }
            break;
          }
        default:
          break;
      }
    }
    setInputValue('');
  };



  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        item
        xs={6}
        sx={{
          backgroundColor: "#161616",
          boxShadow: "4px 10px 40px 0px rgba(0, 0, 0, 0.25)",
          alignItems: "center",
          display: "flex",
        }}
      >
        <Card sx={{ backgroundColor: "transparent" }}>
          <CardMedia
            component="img"
            image={logo}
            alt="green iguana"
            sx={{
              transform: "scale(0.6, 0.6)",
            }}
          />
        </Card>
      </Grid>
      <Grid
        item
        xs={6}
        sx={{
          backgroundColor: "#364F6B",
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#EAEAEA",
            borderRadius: "20px",
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            width: "85%",
            padding: '20px',
            flexShrink: 0,
            position: "absolute",
            left: "-15%",
            overflowY: "hidden",
            maxHeight: "84%"
          }}
        >
          <Box
            sx={{
              mb: 4,
              mt: 2,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "#364F6B" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Đăng Ký
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={HandleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6} className="">
                  <TextField
                    autoComplete="Họ và tên lót"
                    name="lastName"
                    required
                    fullWidth
                    id="lastName"
                    label="Họ và tên lót"
                    onChange={handleChangeInputValue}
                    onBlur={saveInputValue("lastName")}
                  />
                  {lastNameError !== '' ?
                    <Alert sx={{ background: 'transparent' }} severity="error">{lastNameError}</Alert> : null}
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    id="firstName"
                    label="Tên"
                    name="firstName"
                    autoComplete="Tên"
                    onChange={handleChangeInputValue}
                    onBlur={saveInputValue("firstName")}
                  />
                  {firstNameError !== '' ?
                    <Alert sx={{ background: 'transparent'}} severity="error">{firstNameError}</Alert> : null}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="username"
                    label="Tên đăng nhập"
                    type="username"
                    id="username"
                    autoComplete="username" onChange={handleChangeInputValue}
                    onBlur={saveInputValue("username")}
                  />
                  {usernameError !== '' ? <Alert sx={{ background: 'transparent'}} severity="error">{usernameError}</Alert> : null}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={handleChangeInputValue}
                    onBlur={saveInputValue("email")}
                  />
                  {emailError !== '' ? <Alert sx={{ background: 'transparent'}} severity="error">{emailError}</Alert> : null}
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Mật khẩu"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    onChange={handleChangeInputValue}
                    onBlur={saveInputValue("password")}
                  />
                  {passwordError !== '' ? <Alert sx={{ background: 'transparent'}} severity="error">{passwordError}</Alert> : null}
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    name="repeat-password"
                    label="Nhập lại mật khẩu"
                    type="password"
                    id="repeat-password"
                    autoComplete="new-password"
                    onChange={handleChangeInputValue}
                    onBlur={saveInputValue("rePassword")}
                  />
                  {rePasswordError !== '' ? <Alert sx={{ background: 'transparent', paddingLeft: '10' }} severity="error">{rePasswordError}</Alert> : null}
                </Grid>
                {/* <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="Tôi chấp nhận điều khoản"
                  />
                </Grid> */}
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Đăng Ký
              </Button>
              {signInStatus !== "" && (
                <Grid container justifyContent="flex-start">
                  <Typography
                    variant="body2"
                    sx={{ color: "red", marginBottom: 2, fontSize: 16 }}
                  >
                    {signInStatus}
                  </Typography>
                </Grid>
              )}
              <Grid container justifyContent="flex-start">
                <Grid item>
                  <Typography variant="body2">
                    Đã có tài khoản?&nbsp;
                    <Link to="/signin">Đăng nhập</Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
SignUpSide.propTypes = {
  setToken: PropTypes.func.isRequired,
};
