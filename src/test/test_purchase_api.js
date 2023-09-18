const apiUrl = "http://localhost:3000/api/purchases";

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

async function createPurchaseWithDelay(data, delay) {
  try {
    await new Promise((resolve) => setTimeout(resolve, delay));

    const response = await axios.post(apiUrl, data);
    return response.data;
  } catch (error) {
    console.error("Error creating purchase:", error);
    throw error;
  }
}

Promise.all(
  purchasesData.map((data, index) =>
    createPurchaseWithDelay(data, index * 1000)
  )
)
  .then((createdPurchases) => {
    console.log("Created Purchases:", createdPurchases);
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  });
