// Define the API endpoint URL where you want to create purchases
const apiUrl = "http://localhost:3000/api/purchases"; // Replace with your actual API URL

// Define the data for the purchases
const purchasesData = [
  {
    userId: "6501b113a1d7dadcf37ce616",
    productId: "65044af657a05dcc9abeb7af",
    quantity: 4,
  },
  {
    userId: "6501b113a1d7dadcf37ce616",
    productId: "65044af657a05dcc9abeb7af",
    quantity: 2,
  },
];

// Function to create a purchase using Axios
async function createPurchaseWithDelay(data, delay) {
  try {
    await new Promise((resolve) => setTimeout(resolve, delay)); // Add a delay

    const response = await axios.post(apiUrl, data);
    return response.data; // Return the created purchase object
  } catch (error) {
    console.error("Error creating purchase:", error);
    throw error;
  }
}

// Use Promise.all() to create multiple purchases concurrently
Promise.all(
  purchasesData.map((data, index) =>
    createPurchaseWithDelay(data, index * 1000)
  )
)
  .then((createdPurchases) => {
    // All purchases have been created
    console.log("Created Purchases:", createdPurchases);
  })
  .catch((error) => {
    // Handle errors if any of the purchase creations fail
    console.error("An error occurred:", error);
  });
