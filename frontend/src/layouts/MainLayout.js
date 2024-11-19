import { Box, Container } from '@mui/material';
// import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            
            <Container component="main" sx={{ flex: 1, py: 4 }}>
                {children}
            </Container>
            <Footer />
        </Box>
    );
};

export default MainLayout;