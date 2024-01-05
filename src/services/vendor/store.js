const { query } = require("express");
const Store = require("../../models/store/Store");

const createStore = async (query) => {
  try {
    const store = new Store(query);
    return store;
  } catch (err) {
    throw Error(err);
  }
};

const findStore = async (query) => {
  try {
    const store = await Store.findOne(query);
    return store;
  } catch (err) {
    throw Error(err);
  }
};

const deleteStore = async (query) => {
  try {
    const store = await Store.findByIdAndDelete(query);
    return store;
  } catch (err) {
    throw Error(err);
  }
};

const modifyStore = async (query) => {
  try {
    const store = await Store.findByIdAndUpdate(query);
    return store;
  } catch (err) {
    throw Error(err);
  }
};

module.exports = {
  createStore,
  findStore,
  deleteStore,
  modifyStore,
};
