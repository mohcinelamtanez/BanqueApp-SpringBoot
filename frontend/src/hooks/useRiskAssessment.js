import { useState } from "react";
import { riskService } from "../services/riskService";
export function useRiskAssessment() {
  const [state, setState] = useState({
    loading: false,
    result: null,
    error: null,
  });
  const calculate = async (details) => {
    setState({ loading: true, result: null, error: null });
    try {
      const result = await riskService.calculate(details);
      setState({ loading: false, result, error: null });
      return result;
    } catch (error) {
      setState({ loading: false, result: null, error });
      return null;
    }
  };
  return { ...state, calculate };
}
