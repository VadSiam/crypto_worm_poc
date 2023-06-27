import Head from 'next/head';
import LineD3Chart from '../components/D3Chart';
import { Container } from '@mui/material';

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Live Crypto Chart(DEMO!)</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
      </Head>

      <Container maxWidth="lg">
        <LineD3Chart />
      </Container>
    </div >
  );
};

export default Home;
