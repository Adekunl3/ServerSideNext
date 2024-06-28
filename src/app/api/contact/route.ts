// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/app/lib/db/prisma';

export async function POST(request: Request) {
  const { email, fullName, message } = await request.json();

  try {
    // Save to database
    await prisma.contactFormSubmission.create({
      data: {
        email,
        fullName,
        message,
      },
    });

    // Respond immediately after saving to the database
    const response = NextResponse.json({ success: true });

    // Send confirmation email asynchronously
    sendConfirmationEmail(email, fullName, message);

    return response;
  } catch (error) {
    console.error('Error saving to database:', error);
    return NextResponse.json({ success: false, message: 'Failed to send your message. Please try again.' });
  }
}

async function sendConfirmationEmail(email: string, fullName: string, message: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Fidu Stores',
      text: 'Thank you for contacting Fidu Stores. We will get to you shortly.',
    };

    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Contact Form Submission',
      text: `New contact form submission:
            Full Name: ${fullName}
            Email: ${email}
            Message: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(adminMailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
