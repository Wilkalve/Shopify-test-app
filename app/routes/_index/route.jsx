import React from 'react';
import { Link } from 'react-router-dom';


export default function WelcomePage() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f2f4f8' }}>
      {/* Top Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          backgroundColor: '#6a1b9a',
          padding: '16px 40px',
          color: 'white',
          fontFamily: 'Inter, Segoe UI, sans-serif',
          fontSize: '1.6rem',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 10,
        }}
      >
        NVPrint
      </header>

      {/* Welcome Content Area */}
      <main
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '60px',
          maxWidth: '1000px',
          margin: 'auto',
          fontFamily: 'Inter, Segoe UI, sans-serif',
          background: 'linear-gradient(135deg, #f9f9fb 0%, #e3e3f3 100%)',
          borderRadius: '16px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Left Section */}
        <section style={{ flex: '1 1 0%', minWidth: '300px', marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '2.6rem',
              marginBottom: '16px',
              background: 'linear-gradient(90deg, #7f00ff, #e100ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: '1.3',
            }}
          >
            Welcome to NV Print 🚀
          </h1>

          <p style={{ fontSize: '1.2rem', color: '#444', marginBottom: '25px' }}>
            Ready to explore the future of 3D printing inside your Shopify store? Here's how it works.
          </p>

          <ul style={{ lineHeight: '1.8', color: '#333', marginBottom: '30px' }}>
            <li>✅ Upload your 3D files (.stl, .obj, .3mf)</li>
            <li>✅ Select filament, color, and scaling</li>
            <li>✅ Visualize your model before placing an order</li>
          </ul>

          <Link
            to="/StorefrontFilePage"
            style={{
              display: 'inline-block',
              padding: '14px 30px',
              fontSize: '17px',
              fontWeight: '600',
              backgroundColor: '#6a1b9a',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s ease-in-out',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            aria-label="Start uploading your 3D file"
          >
            Get Started
          </Link>

          <p style={{ marginTop: '10px', fontSize: '0.95rem', color: '#777' }}>
            Step-by-step guide included
          </p>
        </section>

        {/* Right Section */}
        <aside style={{ flex: '0 1 280px', textAlign: 'center' }}>
          <img
            src="/images.png" // replace with `previewImage` if using imported asset
            alt="3D Print Preview"
            style={{
              maxWidth: '100%',
              borderRadius: '12px',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
            }}
          />
        </aside>
      </main>
    </div>
  );
}
