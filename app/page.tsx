import { AppTabs } from '@/components/AppTabs';

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#F7F7F7', minHeight: '100vh' }}>
      <main
        style={{
          padding: '0px 24px 24px 24px',
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: 'white',
          minHeight: '100vh',
        }}
      >
        <AppTabs />
      </main>
    </div>
  );
}
