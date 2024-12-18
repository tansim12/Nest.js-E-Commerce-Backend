import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const verifyPayment = async (txnId: string) => {
  const response = await axios.get(
    process.env.AAMAR_PAY_SEARCH_TNX_BASE_URL as string,
    {
      params: {
        signature_key: process.env.AAMAR_PAY_SIGNATURE_KEY,
        store_id: 'aamarpaytest',
        request_id: txnId,
        type: 'json',
      },
    },
  );
  return response?.data;
};
