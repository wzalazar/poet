// TODO: this should be a JSON file! use json-loader?

const config = {
  api: {
    explorer: '/api/explorer',
    user: '/api/user',
    auth: 'ws://192.168.0.168:5000',
    mockApp: '/api/mockApp',
    insight: 'https://test-insight.bitpay.com/api'
  },
  imageUpload: {
    maxWidth: 100,
    maxHeight: 100
  }
};

export default config;