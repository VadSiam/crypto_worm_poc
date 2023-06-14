import Head from 'next/head';
import LiveChart from '../components/LiveChart';
import AnomalyChart from '../components/TestChart';

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

      <main>
        <h1>(DEMO!)Live Crypto Chart: BTC-USDT</h1>

        <LiveChart />
        {/* <AnomalyChart /> */}
      </main>
    </div >
  );
};

export default Home;
