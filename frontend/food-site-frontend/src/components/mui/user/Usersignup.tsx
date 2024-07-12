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
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  contact: string;
  address: string;
  city: string;
  pincode: number;
}

interface SignupResponse {
    msg: string;
    status : Number
  }

export default function SignUp() {

  const { register, handleSubmit, formState: { errors , isSubmitting} } = useForm<IFormInput>();
  const [message,setmessage] = useState('');
   const onSubmit: SubmitHandler<IFormInput> = async (data:IFormInput) => {
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstname: data.firstname,
        lastname: data.lastname,
        username: data.username,
        password: data.password,
        contact: data.contact,
        addresses: {
          houseno: data.address,
          pincode: data.pincode,
          city: data.city,
        },
      }),
    };
      const response = await fetch('http://localhost:3000/api/v1/user/signup', requestOptions);

      if (response.status==200) {
        setmessage("Account Created Succesfully");
        return;
      }

      const responseData: SignupResponse = await response.json();
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
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  {...register('firstname', { required: 'First name is required' })}
                  error={!!errors.firstname}
                  helperText={errors.firstname ? errors.firstname.message : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  autoComplete="family-name"
                  {...register('lastname', { required: 'Last name is required' })}
                  error={!!errors.lastname}
                  helperText={errors.lastname ? errors.lastname.message : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  {...register('username', { required: 'Username is required', minLength: { value: 5, message: 'Username must be at least 5 characters' } })}
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
                  {...register('password', { required: 'Password is required', minLength: { value: 5, message: 'Password must be at least 5 characters' } })}
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="contactNumber"
                  label="Contact Number"
                  autoComplete="tel"
                  type="text"
                  {...register('contact', { 
                    required: 'Contact number is required', 
                    minLength: { value: 10, message: 'Contact number must be exactly 10 characters' },
                    maxLength: { value: 10, message: 'Contact number must be exactly 10 characters' }
                  })}
                  error={!!errors.contact}
                  helperText={errors.contact ? errors.contact.message : ''}

                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  label="Address"
                  autoComplete="street-address"
                  {...register('address', { required: 'Address is required' })}
                  error={!!errors.address}
                  helperText={errors.address ? errors.address.message : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="city"
                  label="City"
                  autoComplete="address-level2"
                  {...register('city', { required: 'City is required' })}
                  error={!!errors.city}
                  helperText={errors.city ? errors.city.message : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="pincode"
                  label="Pincode"
                  autoComplete="postal-code"
                  type="number"
                  {...register('pincode', { required: 'Pincode is required', valueAsNumber: true })}
                  error={!!errors.pincode}
                  helperText={errors.pincode ? errors.pincode.message : ''}
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
              {isSubmitting ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
            <Typography variant="body2" color="error" align="center" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{message}</Typography>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>

      </Container>
    </ThemeProvider>
  );
}
