const axios = require('axios');
const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function getRoomOptions() {
  try {
    const response = await axios.get('https://bot9assignement.deno.dev/rooms');
    return response.data;
  } catch (error) {
    console.error('Error fetching room options:', error);
    throw error;
  }
}

async function bookRoom(roomId, fullName, email, nights) {
  try {
    const response = await axios.post('https://bot9assignement.deno.dev/book', {
      roomId,
      fullName,
      email,
      nights
    });
    console.log('Response', response.data);

    // Send confirmation email
    await sendConfirmationEmail(fullName, email, response.data);
    return response.data;
  } catch (error) {
    console.error('Error booking room:', error);
    throw error;
  }
}

async function sendConfirmationEmail(fullName, email, bookingDetails) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Booking Confirmation - Oterra Hotel',
    html: `
      <h1>Booking Confirmation</h1>
      <p>Dear ${fullName},</p>
      <p>Thank you for booking with Oterra Hotel. Your reservation details are as follows:</p>
      <ul>
        <li>Booking ID: ${bookingDetails.bookingId}</li>
        <li>Room Type: ${bookingDetails.roomName}</li>
        <li>Number of Nights: ${bookingDetails.nights}</li>
        <li>Total Price: $${bookingDetails.totalPrice}</li>
      </ul>
      <p>We look forward to welcoming you to Oterra Hotel!</p>
    `
  };

  console.log(bookingDetails.roomType, "room type");

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}

module.exports = { getRoomOptions, bookRoom };