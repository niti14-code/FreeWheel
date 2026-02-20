const Booking = require('./bookings.model'); 
const Ride = require('../rides/rides.model'); 
const User = require('../users/users.model');

exports.requestBooking = async (req, res) => {
  try {
    const { rideId } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (user.role === 'provider') return res.status(403).json({ message: 'Providers cannot book' });
    
    const ride = await Ride.findById(rideId);
    if (!ride || ride.seatsAvailable < 1) return res.status(400).json({ message: 'No seats available' });
    
    const booking = new Booking({ rideId, seekerId: req.user.userId });
    await booking.save();
    
    ride.seatsAvailable -= 1;
    await ride.save();
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.respondBooking = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    
    const booking = await Booking.findById(bookingId).populate('rideId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    if (booking.rideId.providerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    booking.status = status;
    await booking.save();
    
    if (status === 'rejected') {
      const ride = await Ride.findById(booking.rideId);
      ride.seatsAvailable += 1;
      await ride.save();
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};