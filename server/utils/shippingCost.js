const weightTiers = [
  { max: 500, local: 40, zonal: 60, national: 80 },
  { max: 1000, local: 60, zonal: 90, national: 120 },
  { max: 2000, local: 80, zonal: 120, national: 160 },
  { max: 5000, local: 120, zonal: 180, national: 240 },
  { max: Infinity, local: 180, zonal: 260, national: 340 }
];

export function getZone(sellerPincode, buyerPincode) {
  if (String(sellerPincode).slice(0, 2) === String(buyerPincode).slice(0, 2)) return "local";
  if (String(sellerPincode)[0] === String(buyerPincode)[0]) return "zonal";
  return "national";
}

export function estimateShipping(sellerPincode, buyerPincode, weightGrams) {
  const zone = getZone(sellerPincode, buyerPincode);
  const tier = weightTiers.find((entry) => Number(weightGrams) <= entry.max) || weightTiers[weightTiers.length - 1];
  return { cost: tier[zone], zone, weightGrams: Number(weightGrams || 0) };
}

