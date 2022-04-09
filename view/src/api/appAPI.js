const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

export const getAllApps = async () => {
  const response = await fetch(`${API_ENDPOINT}/app`);
  const apps = await response.json();
  return apps;
};

export const updateSubscription = async () => {
  // await fetch(`${API_ENDPOINT}/subscription/`);
  // return null;
}