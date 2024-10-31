import React from 'react';
import { Container, Box, Typography, Link } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="body2" color="textSecondary" align="center">
                    &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <Link href="/privacy-policy" underline="none" color="inherit" sx={{ mx: 2 }}>
                        Privacy Policy
                    </Link>
                    <Link href="/terms-of-service" underline="none" color="inherit" sx={{ mx: 2 }}>
                        Terms of Service
                    </Link>
                    <Link href="/contact-us" underline="none" color="inherit" sx={{ mx: 2 }}>
                        Contact Us
                    </Link>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
