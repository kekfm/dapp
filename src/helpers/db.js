import axios from "axios";


// Export an object containing the function getCreated
export const db = {
  // Async function to connect to MongoDB and fetch data
  getCreated: async () => {
    try{
      const response = await axios.get('http://103.26.10.88/api/getCreated', { withCredentials: true, timeout: 5000 })
      const data = response.data
      return data
    } catch(e){"error", e}
  },
};
