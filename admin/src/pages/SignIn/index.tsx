import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
//import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../../assets/logo.png';
import google from '../../assets/google.png';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

import Icon from '@mui/material/Icon';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { error } from 'console';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
//@ts-ignore
export default function SignInSide({ setToken }) {

  const [loginState, setLoginState] = useState<Boolean>();

  const nav: any = useNavigate()

  //@ts-ignore
  async function loginUser(credentials) {
    return fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        else if (response.status === 404) {
          setLoginState(false)
        }
        else if (response.status === 401) {
          //
        }
      })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const token = await loginUser({
        username: data.get('username'),
        password: data.get('password'),
      });
      setToken(token); //token là accessToken, refreshToken và userInfo

      // if has token, nav to HomePage
      if (token !== undefined) nav('/');
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={6}
        sx={{
          backgroundColor: '#161616',
          boxShadow: '4px 10px 40px 0px rgba(0, 0, 0, 0.25)',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <Card sx={{ backgroundColor: 'transparent' }}>
          <CardMedia
            component="img"
            image={logo}
            alt="green iguana"
            sx={{
              transform: 'scale(0.6, 0.6)'
            }}
          />
        </Card>
      </Grid>
      <Grid item xs={6} sx={{
        backgroundColor: '#364F6B',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}
      >
        <Box sx={{
          backgroundColor: '#EAEAEA',
          borderRadius: '20px',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
          width: '85%',
          height: '55%',
          flexShrink: 0,
          position: 'absolute',
          left: '-15%'
        }}
        >
          <Box
            sx={{
              my: 4,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: '#364F6B' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Đăng Nhập
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              {loginState === false ?
                <Typography component="p" sx={{ color: "red" }}>
                  Đăng nhập thất bại: Sai tên tài khoản hoặc mật khẩu
                </Typography>
                : null
              }
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
              >
                Đăng nhập
              </Button>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid >
  );
}

SignInSide.propTypes = {
  setToken: PropTypes.func.isRequired
}

