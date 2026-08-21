export const riskService = {
  calculate: ({ amount, duration }) =>
    new Promise((resolve) =>
      setTimeout(() => {
        const score =
          Number(amount) > 100000 ? 68 : Number(duration) > 48 ? 42 : 18;
        resolve({
          score,
          level: score > 60 ? "HIGH" : score > 35 ? "MEDIUM" : "LOW",
        });
      }, 900),
    ),
};
