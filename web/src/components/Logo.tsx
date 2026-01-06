import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <div
      style={{
        padding: '16px',
        textAlign: 'center',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '20px',
            fontFamily: 'LibreBodoni, serif',
            color: '#000000',
            fontWeight: 'normal',
            cursor: 'pointer',
          }}
        >
          Streamly
        </h1>
      </Link>
    </div>
  );
}
