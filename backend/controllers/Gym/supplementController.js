import Supplement from '../../models/Gym/Supplement.js';

export const getAllSupplements = async (req, res) => {
  try {
    const supplements = await Supplement.find({ inStock: true }).sort({ name: 1 });
    res.json({ supplements });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching supplements.', error: error.message });
  }
};

export const createSupplement = async (req, res) => {
  try {
    const supplement = new Supplement(req.body);
    await supplement.save();
    res.status(201).json({ message: 'Supplement created.', supplement });
  } catch (error) {
    res.status(500).json({ message: 'Error creating supplement.', error: error.message });
  }
};

export const updateSupplement = async (req, res) => {
  try {
    const supplement = await Supplement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!supplement) return res.status(404).json({ message: 'Supplement not found.' });
    res.json({ message: 'Supplement updated.', supplement });
  } catch (error) {
    res.status(500).json({ message: 'Error updating supplement.', error: error.message });
  }
};

export const deleteSupplement = async (req, res) => {
  try {
    const supplement = await Supplement.findByIdAndDelete(req.params.id);
    if (!supplement) return res.status(404).json({ message: 'Supplement not found.' });
    res.json({ message: 'Supplement deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting supplement.', error: error.message });
  }
};
