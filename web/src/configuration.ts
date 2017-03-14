/**
 * This file contains configuration for the app.
 *
 * For simplicity and ease of use with an IDE, it's not a JSON file,
 * but in the future it could become one or load info from one.
 */

export const Configuration = {
  api: {
    explorer: '/api/explorer',
    user: '/api/user',
    auth: 'ws://localhost:5000',
    mockApp: '/api/mockApp',
    insight: 'https://test-insight.bitpay.com/api',
    blockchain: 'https://blockchain.info'
  },
  imageUpload: {
    maxWidth: 100,
    maxHeight: 100
  },
  dateFormat: 'MMMM Do YYYY',
  dateTimeFormat: 'MMMM Do YYYY, HH:mm:ss',
  pagination: {
    limit: 10,
    visiblePageCount: 6
  }
};
