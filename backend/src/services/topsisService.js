export const calculateTOPSIS = (bids) => {
  if (!bids || bids.length === 0) return [];
  if (bids.length === 1) {
    return [{
      ...bids[0],
      topsisScore: 1.0,
      rank: 1,
      isAnomaly: false,
      anomalyReason: ''
    }];
  }

  const weights = {
    price: 0.40,
    delivery: 0.25,
    rating: 0.20,
    compliance: 0.15
  };

  const prices = bids.map(b => b.totalPrice || b.unitPrice * 500);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

  const matrix = bids.map(bid => {
    const supplierRating = (bid.supplierId && typeof bid.supplierId === 'object' && bid.supplierId.rating) 
      ? bid.supplierId.rating 
      : (bid.supplierRating || 4.5);

    return {
      raw: bid,
      price: bid.totalPrice || 1000,
      delivery: bid.deliveryDays || 10,
      rating: supplierRating,
      compliance: bid.specComplianceScore || 90
    };
  });

  const denom = {
    price: Math.sqrt(matrix.reduce((sum, row) => sum + Math.pow(row.price, 2), 0)) || 1,
    delivery: Math.sqrt(matrix.reduce((sum, row) => sum + Math.pow(row.delivery, 2), 0)) || 1,
    rating: Math.sqrt(matrix.reduce((sum, row) => sum + Math.pow(row.rating, 2), 0)) || 1,
    compliance: Math.sqrt(matrix.reduce((sum, row) => sum + Math.pow(row.compliance, 2), 0)) || 1
  };

  const weighted = matrix.map(row => ({
    raw: row.raw,
    price: (row.price / denom.price) * weights.price,
    delivery: (row.delivery / denom.delivery) * weights.delivery,
    rating: (row.rating / denom.rating) * weights.rating,
    compliance: (row.compliance / denom.compliance) * weights.compliance
  }));

  const idealBest = {
    price: Math.min(...weighted.map(r => r.price)),
    delivery: Math.min(...weighted.map(r => r.delivery)),
    rating: Math.max(...weighted.map(r => r.rating)),
    compliance: Math.max(...weighted.map(r => r.compliance))
  };

  const idealWorst = {
    price: Math.max(...weighted.map(r => r.price)),
    delivery: Math.max(...weighted.map(r => r.delivery)),
    rating: Math.min(...weighted.map(r => r.rating)),
    compliance: Math.min(...weighted.map(r => r.compliance))
  };

  const scored = weighted.map(row => {
    const dPlus = Math.sqrt(
      Math.pow(row.price - idealBest.price, 2) +
      Math.pow(row.delivery - idealBest.delivery, 2) +
      Math.pow(row.rating - idealBest.rating, 2) +
      Math.pow(row.compliance - idealBest.compliance, 2)
    );

    const dMinus = Math.sqrt(
      Math.pow(row.price - idealWorst.price, 2) +
      Math.pow(row.delivery - idealWorst.delivery, 2) +
      Math.pow(row.rating - idealWorst.rating, 2) +
      Math.pow(row.compliance - idealWorst.compliance, 2)
    );

    const topsisScore = (dPlus + dMinus === 0) ? 0.5 : Number((dMinus / (dPlus + dMinus)).toFixed(4));
    const isAnomaly = (row.raw.totalPrice < avgPrice * 0.55);
    const anomalyReason = isAnomaly 
      ? `Price is ${(100 - (row.raw.totalPrice / avgPrice * 100)).toFixed(0)}% below market average. High risk of substandard materials or supplier default.`
      : '';

    return {
      ...row.raw,
      topsisScore,
      isAnomaly,
      anomalyReason
    };
  });

  scored.sort((a, b) => b.topsisScore - a.topsisScore);
  return scored.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
};
