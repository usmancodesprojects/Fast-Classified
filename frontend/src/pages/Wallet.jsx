import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';

function Wallet({ user }) {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Deposit form
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositProvider, setDepositProvider] = useState('jazzcash');
  const [depositMobile, setDepositMobile] = useState('');
  
  // Withdraw form
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedBankAccount, setSelectedBankAccount] = useState('');
  
  // Add bank account form
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankForm, setBankForm] = useState({
    account_title: '',
    account_number: '',
    bank_name: '',
    iban: '',
    is_primary: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [walletRes, transactionsRes, bankAccountsRes] = await Promise.all([
        api.get('/wallet'),
        api.get('/wallet/transactions'),
        api.get('/wallet/bank-accounts')
      ]);
      setWallet(walletRes.data);
      setTransactions(transactionsRes.data);
      setBankAccounts(bankAccountsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || !depositMobile) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await api.post('/wallet/deposit', {
        amount: parseFloat(depositAmount),
        provider: depositProvider,
        customer_mobile: depositMobile
      });

      if (response.data.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        alert('Deposit initiated. Please complete payment.');
        setShowDepositModal(false);
      }
    } catch (error) {
      console.error('Error initiating deposit:', error);
      alert(error.response?.data?.detail || 'Failed to initiate deposit');
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !selectedBankAccount) {
      alert('Please fill all fields');
      return;
    }

    if (parseFloat(withdrawAmount) > wallet.balance) {
      alert('Insufficient balance');
      return;
    }

    try {
      await api.post('/wallet/withdraw', {
        amount: parseFloat(withdrawAmount),
        bank_account_id: selectedBankAccount
      });

      alert('Withdrawal request submitted successfully');
      setShowWithdrawModal(false);
      fetchData();
    } catch (error) {
      console.error('Error initiating withdrawal:', error);
      alert(error.response?.data?.detail || 'Failed to initiate withdrawal');
    }
  };

  const handleAddBankAccount = async () => {
    if (!bankForm.account_title || !bankForm.account_number || !bankForm.bank_name) {
      alert('Please fill required fields');
      return;
    }

    try {
      await api.post('/wallet/bank-accounts', bankForm);
      setShowBankModal(false);
      setBankForm({
        account_title: '',
        account_number: '',
        bank_name: '',
        iban: '',
        is_primary: false
      });
      fetchData();
    } catch (error) {
      console.error('Error adding bank account:', error);
      alert(error.response?.data?.detail || 'Failed to add bank account');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'payment':
        return '💳';
      case 'deposit':
        return '📥';
      case 'withdrawal':
        return '📤';
      case 'refund':
        return '↩️';
      default:
        return '💰';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'failed':
        return 'badge-error';
      default:
        return 'badge-info';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-secondary)]">
        <Navbar user={user} />
        <div className="flex items-center justify-center py-20">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-8">
          My Wallet
        </h1>

        {/* Balance Card */}
        <div className="card-static mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-[var(--color-text-secondary)] mb-1">Available Balance</p>
              <p className="text-4xl font-bold text-[var(--color-primary)]">
                {formatCurrency(wallet?.balance || 0)}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                Currency: {wallet?.currency || 'PKR'}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDepositModal(true)}
                className="btn-primary"
              >
                Add Funds
              </button>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="btn-secondary"
                disabled={!wallet?.balance || wallet.balance <= 0}
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-[var(--color-border)]">
          {['overview', 'transactions', 'bank-accounts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-static">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📥</span>
                </div>
                <div>
                  <p className="text-[var(--color-text-secondary)] text-sm">Total Deposits</p>
                  <p className="text-xl font-bold text-[var(--color-text-primary)]">
                    {formatCurrency(
                      transactions
                        .filter(t => t.transaction_type === 'deposit' && t.status === 'completed')
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="card-static">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💳</span>
                </div>
                <div>
                  <p className="text-[var(--color-text-secondary)] text-sm">Total Payments</p>
                  <p className="text-xl font-bold text-[var(--color-text-primary)]">
                    {formatCurrency(
                      transactions
                        .filter(t => t.transaction_type === 'payment' && t.status === 'completed')
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="card-static">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📤</span>
                </div>
                <div>
                  <p className="text-[var(--color-text-secondary)] text-sm">Total Withdrawals</p>
                  <p className="text-xl font-bold text-[var(--color-text-primary)]">
                    {formatCurrency(
                      transactions
                        .filter(t => t.transaction_type === 'withdrawal' && t.status === 'completed')
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="card-static">
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl mb-4 block">📋</span>
                <p className="text-[var(--color-text-secondary)]">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-[var(--color-bg-secondary)] rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{getTransactionIcon(transaction.transaction_type)}</span>
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)] capitalize">
                          {transaction.transaction_type}
                        </p>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {transaction.description || 'No description'}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          {formatDate(transaction.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund'
                          ? 'text-[var(--color-success)]'
                          : 'text-[var(--color-text-primary)]'
                      }`}>
                        {transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <span className={`badge ${getStatusBadge(transaction.status)} text-xs`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bank Accounts Tab */}
        {activeTab === 'bank-accounts' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => setShowBankModal(true)}
                className="btn-primary"
              >
                Add Bank Account
              </button>
            </div>

            {bankAccounts.length === 0 ? (
              <div className="card-static text-center py-12">
                <span className="text-4xl mb-4 block">🏦</span>
                <p className="text-[var(--color-text-secondary)]">No bank accounts added</p>
                <button
                  onClick={() => setShowBankModal(true)}
                  className="btn-secondary mt-4"
                >
                  Add Your First Bank Account
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bankAccounts.map((account) => (
                  <div key={account.id} className="card-static">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-[var(--color-text-primary)]">
                          {account.bank_name}
                        </h3>
                        <p className="text-[var(--color-text-secondary)]">
                          {account.account_title}
                        </p>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                          ****{account.account_number.slice(-4)}
                        </p>
                        {account.iban && (
                          <p className="text-xs text-[var(--color-text-secondary)]">
                            IBAN: {account.iban}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {account.is_primary && (
                          <span className="badge badge-success text-xs">Primary</span>
                        )}
                        {account.is_verified ? (
                          <span className="badge badge-success text-xs">Verified</span>
                        ) : (
                          <span className="badge badge-warning text-xs">Pending</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">
              Add Funds to Wallet
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Amount (PKR)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="input-field"
                  min="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDepositProvider('jazzcash')}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      depositProvider === 'jazzcash'
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                        : 'border-[var(--color-border)]'
                    }`}
                  >
                    <span className="font-semibold">JazzCash</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositProvider('easypaisa')}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      depositProvider === 'easypaisa'
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                        : 'border-[var(--color-border)]'
                    }`}
                  >
                    <span className="font-semibold">Easypaisa</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={depositMobile}
                  onChange={(e) => setDepositMobile(e.target.value)}
                  placeholder="03001234567"
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={handleDeposit} className="btn-primary flex-1">
                Proceed to Payment
              </button>
              <button
                onClick={() => setShowDepositModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">
              Withdraw Funds
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Amount (PKR)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="input-field"
                  max={wallet?.balance}
                />
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  Available: {formatCurrency(wallet?.balance || 0)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Bank Account
                </label>
                {bankAccounts.length === 0 ? (
                  <p className="text-[var(--color-text-secondary)]">
                    No bank accounts added.{' '}
                    <button
                      onClick={() => {
                        setShowWithdrawModal(false);
                        setShowBankModal(true);
                      }}
                      className="text-[var(--color-primary)] hover:underline"
                    >
                      Add one now
                    </button>
                  </p>
                ) : (
                  <select
                    value={selectedBankAccount}
                    onChange={(e) => setSelectedBankAccount(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select bank account</option>
                    {bankAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.bank_name} - ****{account.account_number.slice(-4)}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleWithdraw}
                className="btn-primary flex-1"
                disabled={bankAccounts.length === 0}
              >
                Request Withdrawal
              </button>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Bank Account Modal */}
      {showBankModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">
              Add Bank Account
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Account Title *
                </label>
                <input
                  type="text"
                  value={bankForm.account_title}
                  onChange={(e) => setBankForm({...bankForm, account_title: e.target.value})}
                  placeholder="Name on account"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Bank Name *
                </label>
                <select
                  value={bankForm.bank_name}
                  onChange={(e) => setBankForm({...bankForm, bank_name: e.target.value})}
                  className="input-field"
                >
                  <option value="">Select bank</option>
                  <option value="HBL">Habib Bank Limited (HBL)</option>
                  <option value="MCB">MCB Bank</option>
                  <option value="UBL">United Bank Limited (UBL)</option>
                  <option value="Allied Bank">Allied Bank</option>
                  <option value="Bank Alfalah">Bank Alfalah</option>
                  <option value="Meezan Bank">Meezan Bank</option>
                  <option value="Faysal Bank">Faysal Bank</option>
                  <option value="Standard Chartered">Standard Chartered</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Easypaisa">Easypaisa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={bankForm.account_number}
                  onChange={(e) => setBankForm({...bankForm, account_number: e.target.value})}
                  placeholder="Enter account number"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  IBAN (Optional)
                </label>
                <input
                  type="text"
                  value={bankForm.iban}
                  onChange={(e) => setBankForm({...bankForm, iban: e.target.value})}
                  placeholder="PK00XXXX0000000000000000"
                  className="input-field"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_primary"
                  checked={bankForm.is_primary}
                  onChange={(e) => setBankForm({...bankForm, is_primary: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="is_primary" className="text-[var(--color-text-primary)]">
                  Set as primary account
                </label>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={handleAddBankAccount} className="btn-primary flex-1">
                Add Account
              </button>
              <button
                onClick={() => setShowBankModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wallet;

