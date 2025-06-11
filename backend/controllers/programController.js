import Program from '../models/programModel.js';

// @desc    Get all programs
// @route   GET /api/programs
// @access  Public
export const getPrograms = async (req, res) => {
  try {
    const programs = await Program.find({});
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single program
// @route   GET /api/programs/:id
// @access  Public
export const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (program) {
      res.json(program);
    } else {
      res.status(404).json({ message: 'Program not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a program
// @route   POST /api/programs
// @access  Private/Admin
export const createProgram = async (req, res) => {
  try {
    const program = new Program(req.body);
    const createdProgram = await program.save();
    res.status(201).json(createdProgram);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a program
// @route   PUT /api/programs/:id
// @access  Private/Admin
export const updateProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (program) {
      Object.assign(program, req.body);
      const updatedProgram = await program.save();
      res.json(updatedProgram);
    } else {
      res.status(404).json({ message: 'Program not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a program
// @route   DELETE /api/programs/:id
// @access  Private/Admin
export const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (program) {
      await program.deleteOne();
      res.json({ message: 'Program removed' });
    } else {
      res.status(404).json({ message: 'Program not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 