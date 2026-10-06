const VeterinarioModel = require('../models/veterinarios.model');

const getAll = async (req, res) => {
  try {
    const data = await VeterinarioModel.getAll();
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await VeterinarioModel.getById(id);

    if (!item) {
      return res.status(404).json({ ok: false, msg: 'No encontrado' });
    }

    res.json({ ok: true, data: item });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

const create = async (req, res) => {
  try {
    const data = await VeterinarioModel.create(req.body);
    res.status(201).json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const itemActualizado = await VeterinarioModel.update(id, req.body);

    if (!itemActualizado) {
      return res.status(404).json({ ok: false, msg: 'No encontrado' });
    }

    res.json({ ok: true, data: itemActualizado });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await VeterinarioModel.remove(id);

    if (!eliminado) {
      return res.status(404).json({ ok: false, msg: 'No encontrado' });
    }

    res.json({ ok: true, msg: 'Veterinario eliminado' });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };