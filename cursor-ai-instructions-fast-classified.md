# CURSOR AI INSTRUCTIONS: Fast-Classified Production Build

## CRITICAL IMPLEMENTATION RULES

**YOU MUST FOLLOW THESE RULES EXACTLY:**

1. ✅ DO: Implement every feature completely with actual working code
2. ✅ DO: Use real API endpoints and proper error handling
3. ✅ DO: Create production-ready, tested code
4. ❌ DO NOT: Use placeholders, TODOs, or comments like "implement this later"
5. ❌ DO NOT: Skip any feature mentioned in this document
6. ❌ DO NOT: Hallucinate or make assumptions - follow these instructions exactly

---

## PROJECT OVERVIEW

**Application Name:** Fast-Classified  
**Type:** Freelance Tutoring Marketplace (Student-Teacher Platform)  
**Tech Stack:** React + Vite + Tailwind CSS (Frontend), FastAPI + PostgreSQL (Backend)  
**Target Market:** Pakistan  
**Deployment:** Vercel (Frontend), Render/Railway (Backend)

---

## PART 1: VERCEL DEPLOYMENT CONFIGURATION

### Task 1.1: Create vercel.json in Frontend Root

**Location:** `frontend/vercel.json`

**Exact Content:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "@api_url"
  }
}
```

### Task 1.2: Update package.json Build Script

**Location:** `frontend/package.json`

**Add/Update:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "vercel-build": "npm run build"
  }
}
```

### Task 1.3: Create .vercelignore

**Location:** `frontend/.vercelignore`

**Content:**

```
node_modules
.env.local
.env
.DS_Store
```

---

## PART 2: UPWORK-STYLE UI REDESIGN

### Design System Requirements

**Color Palette (Upwork-Inspired):**

```css
:root {
  /* Primary Colors */
  --color-primary: #14A800; /* Upwork Green */
  --color-primary-hover: #0D7A00;
  --color-primary-light: #E8F5E9;
  
  /* Secondary Colors */
  --color-secondary: #001E00;
  --color-accent: #FF6B00;
  
  /* Neutral Colors */
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F7F8F9;
  --color-border: #E4E5E7;
  --color-text-primary: #222222;
  --color-text-secondary: #5E6D55;
  
  /* Status Colors */
  --color-success: #14A800;
  --color-warning: #FF9800;
  --color-error: #D32F2F;
  --color-info: #1976D2;
}
```

### Task 2.1: Update Global Styles

**Location:** `frontend/src/index.css`

**Replace entirely with:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  line-height: 1.6;
}

/* Upwork-style buttons */
.btn-primary {
  background: var(--color-primary);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(20, 168, 0, 0.3);
}

.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  border: 2px solid var(--color-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--color-primary-light);
}

/* Card styles */
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* Input styles */
.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

/* Badge styles */
.badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
}

.badge-success {
  background: var(--color-primary-light);
  color: var(--color-success);
}

.badge-warning {
  background: #FFF3E0;
  color: var(--color-warning);
}

.badge-error {
  background: #FFEBEE;
  color: var(--color-error);
}
```

### Task 2.2: Update Tailwind Configuration

**Location:** `frontend/tailwind.config.js`

**Replace with:**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#14A800',
          hover: '#0D7A00',
          light: '#E8F5E9',
        },
        secondary: '#001E00',
        accent: '#FF6B00',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'upwork': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'upwork-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
```

---

## PART 3: MISSING PRODUCTION FEATURES

### Feature 3.1: Real-Time Messaging System

**Location:** Create `frontend/src/pages/Messages.jsx`

**Implementation Requirements:**

```javascript
// MUST implement actual WebSocket connection
// MUST show real-time message delivery
// MUST include typing indicators
// MUST support file attachments
// MUST show online/offline status

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

function Messages({ user }) {
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    // Initialize WebSocket connection
    const newSocket = io(import.meta.env.VITE_API_URL, {
      query: { token: localStorage.getItem('token') }
    });
    
    setSocket(newSocket);

    newSocket.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('typing', ({ userId, isTyping }) => {
      setTyping(isTyping);
    });

    return () => newSocket.close();
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    socket.emit('send_message', {
      chatId: selectedChat.id,
      content: newMessage,
      senderId: user.id
    });

    setNewMessage('');
  };

  // REST OF IMPLEMENTATION...
}
```

**Backend WebSocket Handler (MUST CREATE):**

**Location:** Create `backend/websocket.py`

```python
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_text(message)

manager = ConnectionManager()
```

### Feature 3.2: Session Booking & Scheduling

**Location:** Create `frontend/src/pages/BookSession.jsx`

**Requirements:**

- Calendar integration
- Time slot selection
- Duration selection (30min, 1hr, 2hr)
- Recurring session option
- Price calculation
- Confirmation email

**Implementation:**

```javascript
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function BookSession({ teacherId, hourlyRate }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [duration, setDuration] = useState(1); // hours
  const [recurring, setRecurring] = useState(false);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const calculateTotal = () => {
    return hourlyRate * duration;
  };

  const bookSession = async () => {
    const booking = {
      teacherId,
      date: selectedDate.toISOString(),
      time: selectedTime,
      duration,
      recurring,
      totalAmount: calculateTotal()
    };

    const response = await api.post('/sessions/book', booking);
    // Handle response
  };

  return (
    <div className="container mx-auto p-6">
      <div className="card max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Book a Session</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              minDate={new Date()}
            />
          </div>

          {/* Time Slots */}
          <div>
            <h3 className="font-semibold mb-4">Available Time Slots</h3>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-lg border-2 ${
                    selectedTime === time 
                      ? 'border-primary bg-primary-light' 
                      : 'border-gray-300'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Duration Selection */}
        <div className="mt-6">
          <label className="block font-semibold mb-2">Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="input-field"
          >
            <option value={0.5}>30 minutes</option>
            <option value={1}>1 hour</option>
            <option value={1.5}>1.5 hours</option>
            <option value={2}>2 hours</option>
          </select>
        </div>

        {/* Recurring Option */}
        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            id="recurring"
            checked={recurring}
            onChange={(e) => setRecurring(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="recurring">Make this a recurring session</label>
        </div>

        {/* Price Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <span>Hourly Rate:</span>
            <span>${hourlyRate}/hour</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Duration:</span>
            <span>{duration} hour(s)</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
            <span>Total:</span>
            <span className="text-primary">${calculateTotal()}</span>
          </div>
        </div>

        <button
          onClick={bookSession}
          disabled={!selectedTime}
          className="btn-primary w-full mt-6"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}

export default BookSession;
```

### Feature 3.3: Reviews & Rating System

**Location:** Create `frontend/src/components/ReviewSystem.jsx`

**Requirements:**

- 5-star rating
- Written review
- Verified session badge
- Helpful votes
- Response from teacher

```javascript
import { useState } from 'react';

function ReviewSystem({ teacherId, userId, canReview }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const submitReview = async () => {
    const reviewData = {
      teacherId,
      userId,
      rating,
      review,
      createdAt: new Date().toISOString()
    };

    const response = await api.post('/reviews/create', reviewData);
    // Handle response
  };

  return (
    <div className="card mt-6">
      <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
      
      {/* Star Rating */}
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(star)}
            className="text-3xl transition-all"
          >
            <span className={
              star <= (hoveredRating || rating) 
                ? 'text-yellow-400' 
                : 'text-gray-300'
            }>
              ★
            </span>
          </button>
        ))}
        <span className="ml-2 text-lg font-semibold">
          {rating > 0 ? `${rating}/5` : 'Select rating'}
        </span>
      </div>

      {/* Written Review */}
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Share your experience with this teacher..."
        className="input-field h-32 mb-4"
      />

      <button
        onClick={submitReview}
        disabled={rating === 0 || review.length < 10}
        className="btn-primary"
      >
        Submit Review
      </button>
    </div>
  );
}

export default ReviewSystem;
```

---

## PART 4: PAKISTANI PAYMENT INTEGRATION

### Payment Gateway: JazzCash + Easypaisa

**Location:** Create `backend/payment.py`

**CRITICAL: Use actual working APIs from JazzCash and Easypaisa**

```python
import hashlib
import hmac
import requests
from datetime import datetime
from typing import Dict, Optional

class PaymentGateway:
    def __init__(self, provider: str):
        self.provider = provider
        if provider == "jazzcash":
            self.merchant_id = os.getenv("JAZZCASH_MERCHANT_ID")
            self.password = os.getenv("JAZZCASH_PASSWORD")
            self.integrity_salt = os.getenv("JAZZCASH_INTEGRITY_SALT")
            self.base_url = os.getenv("JAZZCASH_API_URL", "https://sandbox.jazzcash.com.pk")
        elif provider == "easypaisa":
            self.store_id = os.getenv("EASYPAISA_STORE_ID")
            self.hash_key = os.getenv("EASYPAISA_HASH_KEY")
            self.base_url = os.getenv("EASYPAISA_API_URL", "https://sandbox-developer.easypaisa.com.pk")

    def generate_transaction_id(self) -> str:
        """Generate unique transaction ID"""
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        return f"T{timestamp}{self.merchant_id[-4:]}"

    def calculate_hash_jazzcash(self, data: Dict) -> str:
        """Calculate HMAC-SHA256 hash for JazzCash"""
        # Order matters for hash calculation
        sorted_string = "&".join([
            str(data.get(key, ""))
            for key in sorted(data.keys())
        ])
        sorted_string += self.integrity_salt
        
        return hmac.new(
            self.integrity_salt.encode(),
            sorted_string.encode(),
            hashlib.sha256
        ).hexdigest().upper()

    def initiate_payment_jazzcash(self, amount: float, customer_email: str, 
                                  customer_mobile: str, description: str) -> Dict:
        """Initiate JazzCash payment transaction"""
        transaction_id = self.generate_transaction_id()
        
        data = {
            "pp_Version": "1.1",
            "pp_TxnType": "MWALLET",
            "pp_Language": "EN",
            "pp_MerchantID": self.merchant_id,
            "pp_SubMerchantID": "",
            "pp_Password": self.password,
            "pp_TxnRefNo": transaction_id,
            "pp_Amount": str(int(amount * 100)),  # Convert to paisa
            "pp_TxnCurrency": "PKR",
            "pp_TxnDateTime": datetime.now().strftime("%Y%m%d%H%M%S"),
            "pp_BillReference": transaction_id,
            "pp_Description": description,
            "pp_TxnExpiryDateTime": (datetime.now() + timedelta(hours=1)).strftime("%Y%m%d%H%M%S"),
            "pp_ReturnURL": f"{os.getenv('FRONTEND_URL')}/payment/callback",
            "pp_SecureHash": "",
            "ppmpf_1": customer_email,
            "ppmpf_2": customer_mobile,
        }
        
        # Calculate and add secure hash
        data["pp_SecureHash"] = self.calculate_hash_jazzcash(data)
        
        # Make API request
        response = requests.post(
            f"{self.base_url}/CustomerPortal/transactionManagement/merchantForm",
            data=data
        )
        
        return {
            "transaction_id": transaction_id,
            "payment_url": response.url if response.status_code == 200 else None,
            "status": "initiated" if response.status_code == 200 else "failed"
        }

    def calculate_hash_easypaisa(self, data: Dict) -> str:
        """Calculate hash for Easypaisa"""
        hash_string = f"{data['amount']}{data['orderRefNum']}{self.store_id}{data['postBackURL']}{self.hash_key}"
        return hashlib.sha256(hash_string.encode()).hexdigest()

    def initiate_payment_easypaisa(self, amount: float, customer_email: str,
                                   customer_mobile: str, description: str) -> Dict:
        """Initiate Easypaisa payment transaction"""
        transaction_id = self.generate_transaction_id()
        
        data = {
            "storeId": self.store_id,
            "amount": str(amount),
            "postBackURL": f"{os.getenv('BACKEND_URL')}/api/payment/easypaisa/callback",
            "orderRefNum": transaction_id,
            "expiryDate": (datetime.now() + timedelta(hours=1)).strftime("%Y%m%d %H%M%S"),
            "merchantHashedReq": "",
            "autoRedirect": "1",
            "paymentMethod": "MA_PAYMENT_METHOD",
            "emailAddress": customer_email,
            "mobileNumber": customer_mobile,
        }
        
        # Calculate hash
        data["merchantHashedReq"] = self.calculate_hash_easypaisa(data)
        
        # Create payment request
        response = requests.post(
            f"{self.base_url}/api/v1/checkout",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        
        result = response.json()
        
        return {
            "transaction_id": transaction_id,
            "payment_url": result.get("checkoutUrl"),
            "token": result.get("token"),
            "status": "initiated" if response.status_code == 200 else "failed"
        }

    def verify_payment(self, transaction_data: Dict) -> bool:
        """Verify payment callback"""
        if self.provider == "jazzcash":
            received_hash = transaction_data.get("pp_SecureHash")
            calculated_hash = self.calculate_hash_jazzcash(transaction_data)
            return received_hash == calculated_hash
        
        elif self.provider == "easypaisa":
            # Verify Easypaisa transaction
            received_hash = transaction_data.get("merchantHashedReq")
            calculated_hash = self.calculate_hash_easypaisa(transaction_data)
            return received_hash == calculated_hash
        
        return False

# FastAPI Endpoints
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

router = APIRouter()

class PaymentInitiateRequest(BaseModel):
    amount: float
    customer_email: str
    customer_mobile: str
    description: str
    session_id: str
    provider: str  # "jazzcash" or "easypaisa"

@router.post("/payment/initiate")
async def initiate_payment(request: PaymentInitiateRequest, db: Session = Depends(get_db)):
    """Initiate payment transaction"""
    
    # Validate amount
    if request.amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")
    
    # Create payment gateway instance
    gateway = PaymentGateway(request.provider)
    
    # Initiate payment
    if request.provider == "jazzcash":
        result = gateway.initiate_payment_jazzcash(
            amount=request.amount,
            customer_email=request.customer_email,
            customer_mobile=request.customer_mobile,
            description=request.description
        )
    else:
        result = gateway.initiate_payment_easypaisa(
            amount=request.amount,
            customer_email=request.customer_email,
            customer_mobile=request.customer_mobile,
            description=request.description
        )
    
    # Store transaction in database
    transaction = Transaction(
        id=result["transaction_id"],
        session_id=request.session_id,
        amount=request.amount,
        status="pending",
        provider=request.provider,
        created_at=datetime.utcnow()
    )
    db.add(transaction)
    db.commit()
    
    return result

@router.post("/payment/{provider}/callback")
async def payment_callback(provider: str, request: Request, db: Session = Depends(get_db)):
    """Handle payment callback"""
    
    # Get transaction data
    if provider == "jazzcash":
        transaction_data = await request.form()
    else:
        transaction_data = await request.json()
    
    # Create gateway instance
    gateway = PaymentGateway(provider)
    
    # Verify payment
    is_valid = gateway.verify_payment(dict(transaction_data))
    
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    
    # Update transaction status
    transaction_id = transaction_data.get("pp_TxnRefNo") if provider == "jazzcash" else transaction_data.get("orderRefNum")
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Check payment status
    response_code = transaction_data.get("pp_ResponseCode") if provider == "jazzcash" else transaction_data.get("responseCode")
    
    if response_code == "000":  # Success
        transaction.status = "completed"
        transaction.payment_reference = transaction_data.get("pp_TxnRefNo") if provider == "jazzcash" else transaction_data.get("transactionId")
        
        # Update session booking status
        session = db.query(Session).filter(Session.id == transaction.session_id).first()
        if session:
            session.payment_status = "paid"
            session.status = "confirmed"
    else:
        transaction.status = "failed"
    
    db.commit()
    
    return {"status": transaction.status}
```

**Frontend Payment Component:**

**Location:** Create `frontend/src/components/PaymentForm.jsx`

```javascript
import { useState } from 'react';
import api from '../api';

function PaymentForm({ sessionDetails, onSuccess }) {
  const [selectedProvider, setSelectedProvider] = useState('jazzcash');
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    mobile: ''
  });

  const initiatePayment = async () => {
    setLoading(true);
    
    try {
      const response = await api.post('/payment/initiate', {
        amount: sessionDetails.totalAmount,
        customer_email: customerInfo.email,
        customer_mobile: customerInfo.mobile,
        description: `Tutoring Session - ${sessionDetails.subject}`,
        session_id: sessionDetails.id,
        provider: selectedProvider
      });

      if (response.data.payment_url) {
        // Redirect to payment gateway
        window.location.href = response.data.payment_url;
      } else {
        alert('Failed to initiate payment. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment initiation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

      {/* Session Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-2">Session Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subject:</span>
            <span className="font-semibold">{sessionDetails.subject}</span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span>{sessionDetails.duration} hour(s)</span>
          </div>
          <div className="flex justify-between">
            <span>Date & Time:</span>
            <span>{sessionDetails.dateTime}</span>
          </div>
          <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
            <span>Total Amount:</span>
            <span className="text-primary">PKR {sessionDetails.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block font-semibold mb-2">Email Address</label>
          <input
            type="email"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
            className="input-field"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Mobile Number</label>
          <input
            type="tel"
            value={customerInfo.mobile}
            onChange={(e) => setCustomerInfo({...customerInfo, mobile: e.target.value})}
            className="input-field"
            placeholder="03001234567"
          />
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="font-semibold mb-4">Select Payment Method</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedProvider('jazzcash')}
            className={`p-4 border-2 rounded-lg transition-all ${
              selectedProvider === 'jazzcash'
                ? 'border-primary bg-primary-light'
                : 'border-gray-300'
            }`}
          >
            <img src="/jazzcash-logo.png" alt="JazzCash" className="h-12 mx-auto mb-2" />
            <span className="block text-center font-semibold">JazzCash</span>
          </button>
          <button
            onClick={() => setSelectedProvider('easypaisa')}
            className={`p-4 border-2 rounded-lg transition-all ${
              selectedProvider === 'easypaisa'
                ? 'border-primary bg-primary-light'
                : 'border-gray-300'
            }`}
          >
            <img src="/easypaisa-logo.png" alt="Easypaisa" className="h-12 mx-auto mb-2" />
            <span className="block text-center font-semibold">Easypaisa</span>
          </button>
        </div>
      </div>

      {/* Proceed Button */}
      <button
        onClick={initiatePayment}
        disabled={loading || !customerInfo.email || !customerInfo.mobile}
        className="btn-primary w-full"
      >
        {loading ? 'Processing...' : `Pay PKR ${sessionDetails.totalAmount} with ${selectedProvider === 'jazzcash' ? 'JazzCash' : 'Easypaisa'}`}
      </button>

      {/* Security Notice */}
      <p className="text-sm text-gray-600 text-center mt-4">
        🔒 Your payment is secure and encrypted. We never store your payment information.
      </p>
    </div>
  );
}

export default PaymentForm;
```

---

## PART 5: ADDITIONAL PRODUCTION FEATURES

### Feature 5.1: Advanced Search & Filters

**Location:** Update `frontend/src/pages/TeacherSearch.jsx`

**Add these filters:**

- Subject (dropdown)
- Price range (slider)
- Rating (4+ stars, 4.5+ stars, etc.)
- Availability (today, this week, flexible)
- Experience level (beginner friendly, advanced)
- Teaching format (online, in-person, hybrid)
- Language (English, Urdu, both)
- Sort by (rating, price low-to-high, price high-to-low, most reviewed)

```javascript
const [filters, setFilters] = useState({
  subject: '',
  minPrice: 0,
  maxPrice: 5000,
  minRating: 0,
  availability: '',
  experienceLevel: '',
  format: '',
  language: '',
  sortBy: 'rating'
});
```

### Feature 5.2: Notifications System

**Location:** Create `frontend/src/components/Notifications.jsx`

**Types of notifications:**

- New message received
- Session booked
- Payment received
- Review posted
- Teacher accepted request
- Session reminder (24hrs before)

### Feature 5.3: Admin Dashboard

**Location:** Create `frontend/src/pages/AdminDashboard.jsx`

**Features:**

- User management
- Transaction monitoring
- Dispute resolution
- Platform analytics
- Content moderation

### Feature 5.4: Teacher Verification Badge

**Requirements:**

- ID verification
- Education certificates
- Background check
- Bank account verification

### Feature 5.5: Wallet System

**Allow users to:**

- Add funds to wallet
- Withdraw to bank account
- View transaction history
- Auto-refund on cancellation

---

## PART 6: ENVIRONMENT VARIABLES

### Frontend (.env)

**Location:** `frontend/.env`

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_SOCKET_URL=wss://your-backend-url.onrender.com
```

### Backend (.env)

**Location:** `backend/.env`

```env
# Database
DATABASE_URL=postgresql://user:password@host/database

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Payment Gateways
JAZZCASH_MERCHANT_ID=your_merchant_id
JAZZCASH_PASSWORD=your_password
JAZZCASH_INTEGRITY_SALT=your_integrity_salt
JAZZCASH_API_URL=https://payments.jazzcash.com.pk

EASYPAISA_STORE_ID=your_store_id
EASYPAISA_HASH_KEY=your_hash_key
EASYPAISA_API_URL=https://easypaisa.com.pk/easypay

# Frontend URL
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-backend.onrender.com

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

---

## PART 7: DEPLOYMENT CHECKLIST

### Pre-Deployment Tasks

- [ ] All features implemented and tested
- [ ] No console errors or warnings
- [ ] All API endpoints working
- [ ] Payment integration tested in sandbox
- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] Security audit passed
- [ ] Performance optimization done
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing completed

### Vercel Deployment Steps

1. Push code to GitHub
2. Connect Vercel to GitHub repository
3. Configure build settings:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables in Vercel dashboard
5. Deploy

### Backend Deployment (Render)

1. Create new Web Service on Render
2. Connect GitHub repository
3. Configure:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add PostgreSQL database
5. Configure environment variables
6. Deploy

---

## PART 8: TESTING REQUIREMENTS

### Unit Tests (MUST CREATE)

**Location:** Create `backend/tests/test_payment.py`

```python
import pytest
from payment import PaymentGateway

def test_jazzcash_hash_calculation():
    gateway = PaymentGateway("jazzcash")
    data = {
        "pp_Amount": "10000",
        "pp_TxnRefNo": "T20240101120000"
    }
    hash_result = gateway.calculate_hash_jazzcash(data)
    assert isinstance(hash_result, str)
    assert len(hash_result) == 64  # SHA256 hex

def test_payment_initiation():
    gateway = PaymentGateway("jazzcash")
    result = gateway.initiate_payment_jazzcash(
        amount=100.0,
        customer_email="test@example.com",
        customer_mobile="03001234567",
        description="Test payment"
    )
    assert result["status"] in ["initiated", "failed"]
    assert "transaction_id" in result
```

### Integration Tests

**Test all critical flows:**

1. User registration → Profile creation → Session booking → Payment → Confirmation
2. Teacher signup → Profile setup → Receive request → Accept → Conduct session
3. Message sending → Real-time delivery → Read receipts
4. Review posting → Verification → Display

---

## CRITICAL SUCCESS CRITERIA

**Before marking this task as complete, verify:**

1. ✅ Vercel deployment works without errors
2. ✅ All 8 main features fully implemented
3. ✅ JazzCash AND Easypaisa both working
4. ✅ Real-time messaging functional
5. ✅ Session booking end-to-end works
6. ✅ Payment flow tested in sandbox
7. ✅ UI matches Upwork quality standards
8. ✅ Mobile responsive on all pages
9. ✅ No placeholder code or TODOs
10. ✅ Production-ready error handling

---

## FINAL NOTES FOR CURSOR AI

**YOU MUST:**

- Generate complete, working code for every feature
- Use actual payment gateway APIs (not fake/mock)
- Test all endpoints before marking complete
- Follow Upwork UI/UX standards exactly
- Handle all edge cases and errors
- Write production-quality code
- Add proper logging and monitoring
- Implement security best practices

**YOU MUST NOT:**

- Use placeholders or TODO comments
- Skip any feature mentioned
- Make assumptions without clarification
- Use deprecated libraries
- Ignore error handling
- Create untested code

This document contains EXACT requirements. Follow them precisely.

---

**Document Version:** 1.0  
**Last Updated:** November 28, 2025  
**Target Completion:** Production-ready MVP within 7 days
