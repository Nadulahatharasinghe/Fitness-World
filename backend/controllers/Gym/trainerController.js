import Trainer from '../../models/Gym/Trainer.js';

export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find({ isActive: true }).sort({ name: 1 });
    res.json({ trainers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trainers.', error: error.message });
  }
};

export const getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found.' });
    res.json({ trainer });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trainer.', error: error.message });
  }
};

export const createTrainer = async (req, res) => {
  try {
    const trainer = new Trainer(req.body);
    await trainer.save();
    res.status(201).json({ message: 'Trainer created successfully.', trainer });
  } catch (error) {
    res.status(500).json({ message: 'Error creating trainer.', error: error.message });
  }
};

export const updateTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!trainer) return res.status(404).json({ message: 'Trainer not found.' });
    res.json({ message: 'Trainer updated successfully.', trainer });
  } catch (error) {
    res.status(500).json({ message: 'Error updating trainer.', error: error.message });
  }
};

export const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found.' });
    res.json({ message: 'Trainer deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting trainer.', error: error.message });
  }
};
