import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PaymentForm from '../components/PaymentForm';

function Payment({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, teacher } = location.state || {};

  if (!session) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-secondary)]">
        <Navbar user={user} />
        <div className="container mx-auto px-4 py-8">
          <div className="card-static text-center">
            <p className="text-xl text-[var(--color-text-secondary)] mb-4">
              No session data found
            </p>
            <button
              onClick={() => navigate('/teachers')}
              className="btn-primary"
            >
              Find Teachers
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sessionDetails = {
    ...session,
    teacher_name: teacher?.name || session.teacher_name,
    totalAmount: session.total_amount
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 py-8">
        <PaymentForm
          sessionDetails={sessionDetails}
          onCancel={() => navigate(-1)}
        />
      </div>
    </div>
  );
}

export default Payment;

