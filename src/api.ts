import axios from 'axios';

export const getCities = () => {
  return axios.get(`https://api-rust-production.up.railway.app/cities`);
};

export const findCost = ({
  origin,
  destination,
  weight,
  courier,
}: {
  origin: string | null;
  destination: string | null;
  weight: number | null;
  courier: string | null;
}) => {
  return axios.post(`https://api-rust-production.up.railway.app/cost`, {
    origin,
    destination,
    weight,
    courier,
  });
};