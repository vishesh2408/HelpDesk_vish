import React from 'react';

const credentials = [
  {
    role: 'User',
    email: 'visheshyadav62@gmail.com',
    password: 'user@2408',
  },
  {
    role: 'Agent',
    email: 'visheshyadav2408@gmail.com',
    password: 'user@2409',
  },
  {
    role: 'Admin',
    email: 'visheshyadav68@gmail.com',
    password: 'user@2408',
  },
];

const TestCredentials = () => {
  return (
    <div className="credentials-container">
      <h2>Login Credentials for Testing</h2>
      <div className="cards-wrapper">
        {credentials.map((cred, index) => (
          <div className="credential-card" key={index}>
            <h3>{cred.role}</h3>
            <p><strong>Email:</strong> {cred.email}</p>
            <p><strong>Password:</strong> {cred.password}</p>
          </div>
        ))}
      </div>

      {/* CSS included inside the component */}
      <style jsx>{`
        .credentials-container {
          max-width: 900px;
          margin: 50px auto;
          padding: 20px;
          text-align: center;
          font-family: 'Poppins', sans-serif;
          background-color: #f9f9f9;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .credentials-container h2 {
          margin-bottom: 30px;
          color: #333;
        }

        .cards-wrapper {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
        }

        .credential-card {
          background-color: #fff;
          border-radius: 10px;
          padding: 20px 25px;
          width: 250px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .credential-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .credential-card h3 {
          margin-bottom: 15px;
          color: #0077ff;
        }

        .credential-card p {
          margin: 5px 0;
          color: #555;
        }

        .credential-card strong {
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default TestCredentials;
