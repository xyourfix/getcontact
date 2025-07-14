const { hexToUtf8 } = require('./crypt');

module.exports = async (hexUrl, data, headers) => {
  return require('axios').post(hexToUtf8(hexUrl), { data }, { headers });
};