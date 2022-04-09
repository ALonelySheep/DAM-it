const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

export const getAllSubscriptions = async () => {
  const response = await fetch(`${API_ENDPOINT}/subscription`);
  const subscriptions = await response.json();
  // console.log(subscriptions)
  return subscriptions;
};

export const addSubscription = async (subscription) => {
  const response = await fetch(`${API_ENDPOINT}/subscription`, {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const newSubscription = await response.json();

  return newSubscription;
};