const client = require('../config/db');

const bookTicket = async (req, res) => {
  const { bookedSeats} = req.body;

  console.log('booking tickets...');

    try {
      await client.query('BEGIN'); // Start transaction

      for (let seatNumber of bookedSeats) {
        await client.query(
          'UPDATE seats SET status = $1 WHERE seat_number = $2',
          ['booked', seatNumber]
        );
      }

      await client.query('COMMIT');

      console.log('transaction successful and seats booked');
      res.status(200).json({ message: 'Seats booked successfully' });

  } catch (error) {
    // Rollback the transaction in case of an error
    await client.query('ROLLBACK');
    
    console.error('Error booking tickets:', error);
    res.status(500).json({ error: 'Booking failed' });
  }  
};

const getSeat = async (req, res) => {
  console.log('Fetching all seats...');
  try {
    const result = await client.query('SELECT seat_number, status FROM seats');

    console.log('Seat fetched and returned');
    
    const seats = result.rows; // This contains all the seat numbers and their statuses
    res.status(200).json({ seats });
  } catch (error) {
    console.error('Error fetching seats:', error);
    res.status(500).json({ error: 'Failed to fetch seats' });
  }
};

const resetSeat = async (req, res) => {
  console.log('resetting seat..');
  try{
    await client.query("UPDATE seats SET status = 'available', user_id = NULL");

    console.log('reset the seat');
    res.status(200).json({message: 'Reset seat successful'});
  } catch(error){
    console.error('Error resetting seats:', error);
    res.status(500).json({ error: 'Failed to reset seats' });
  }
};
  
module.exports = { bookTicket, getSeat, resetSeat };
  
