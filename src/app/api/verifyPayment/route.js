import { NextResponse } from 'next/server';
import { verifyTransaction } from 'flutterwave-node-v3';

export async function POST(request) {
  const { transactionId } = await request.json();

  try {
    const response = await verifyTransaction(transactionId, process.env.FLUTTERWAVE_SECRET_KEY);

    if (response.status === 'success') {
      // Handle successful transaction here (e.g., update order status)
      return NextResponse.json({ message: 'Transaction verified successfully', data: response.data });
    } else {
      return NextResponse.json({ message: 'Transaction verification failed', data: response.data });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error }, { status: 500 });
  }
}
