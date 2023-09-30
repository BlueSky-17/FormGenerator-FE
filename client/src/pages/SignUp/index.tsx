import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
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

export default function SignInSide() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
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
              Đăng Ký
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="Tôi chấp nhận điều khoản"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Đăng Ký
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Typography variant="body2">
                    Đã có tài khoản?
                    <Link to="/signin" >
                      Đăng nhập
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Grid >
    </Grid >
  );
}