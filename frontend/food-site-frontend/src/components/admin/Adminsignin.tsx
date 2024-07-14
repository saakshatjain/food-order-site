import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form'; 


const defaultTheme = createTheme();

interface IFormInput {
  username: string;
  password: string;
}

interface SigninResponse {
    msg: string;
    status : Number
  }

export default function AdminSignIn() {

  const { register, handleSubmit, formState: { errors , isSubmitting} } = useForm<IFormInput>();
  const [message,setmessage] = useState('');
   const onSubmit: SubmitHandler<IFormInput> = async (data:IFormInput) => {
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
      }),
    };
      const response = await fetch('http://localhost:3000/api/v1/admin/signin', requestOptions);

      if (response.status==200) {
        setmessage("Signed In");
        const data = await response.json();
        const jwt= data.token;
        localStorage.setItem("token",jwt);
        return;
      }

      const responseData: SigninResponse = await response.json();
      setmessage(responseData.msg);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src="https://images-platform.99static.com/A_Ax0GQuo_NHI0Y7XZHmFtGfBDY=/0x0:1000x1000/500x500/top/smart/99designs-contests-attachments/126/126252/attachment_126252018" alt="Sign Up" style={{ width: 60, height: 60, borderRadius: '50%' }} />
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  {...register('username', { required: 'Username is required'})}
                  error={!!errors.username}
                  helperText={errors.username ? errors.username.message : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  {...register('password', { required: 'Password is required'})}
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ''}
                />
              </Grid>
              </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            <Typography variant="body2" color="error" align="center" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{message}</Typography>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Dont have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>

      </Container>
    </ThemeProvider>
  );
}
