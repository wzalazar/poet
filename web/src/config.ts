/**
 * This file contains configuration for the app.
 *
 * For simplicity and ease of use with an IDE, it's not a JSON file,
 * but in the future it could become one or load info from one.
 */

export const Config = {
  api: {
    explorer: '/api/explorer',
    user: '/api/user',
    auth: 'ws://localhost:5000',
    mockApp: '/api/mockApp',
    insight: 'https://test-insight.bitpay.com/api'
  },
  imageUpload: {
    maxWidth: 100,
    maxHeight: 100
  },
  dateFormat: 'MMMM Do YYYY'
};

export const Configuration = config;

export default Config;
