import * as React from 'react';
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

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

import CircleIcon from '@mui/icons-material/Circle';
import Icon from '@mui/material/Icon';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { error } from 'console';


function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link to='/'>
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
//@ts-ignore
async function loginUser(credentials) {
  return fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
 }

 //@ts-ignore
export default function SignInSide({setToken}) {
  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    try{
      const token = await loginUser({
        username: data.get('username'),
        password: data.get('password'),
      });
      setToken(token);      
    }
    catch(error){
      console.log(error)
    }

  };

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
        position: 'relative'
      }}
      >
        <Box sx={{
          backgroundColor: '#EAEAEA',
          borderRadius: '20px',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
          width: '85%',
          height: '70%',
          flexShrink: 0,
          position: 'absolute',
          left: '-15%'
        }}
        >
          <CircleIcon sx={{
            color: 'white',
            position: 'absolute',
            left: '-1%',
            top: '-1%',
            transform: 'scale(3.5, 3.5)'
          }} />
          <CircleIcon sx={{
            color: '#364F6B',
            position: 'absolute',
            left: '-1%',
            top: '-1%',
            transform: 'scale(2.8, 2.8)'
          }} />
          <Box
            sx={{
              my: 8,
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
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Email Address"
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
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Duy trì đăng nhập"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Đăng nhập
              </Button>
              <Grid container>
                <Grid item xs>
                  <Typography variant="body2">
                    <Link to="/signin">
                      Bạn quên mật khẩu?
                    </Link>
                  </Typography>
                </Grid>
                <Grid item >
                  <Typography variant="body2">
                    Bạn chưa có tài khoản?
                    <Link to='/signup'>
                      {"Đăng ký ngay"}
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
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