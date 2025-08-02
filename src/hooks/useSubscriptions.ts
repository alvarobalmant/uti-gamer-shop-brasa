// Temporary stub for useSubscriptions hook
export const useSubscriptions = () => {
  return {
    hasActiveSubscription: () => false,
    subscription: null,
    loading: false,
    error: null,
    refreshSubscription: () => Promise.resolve(),
    plans: [],
    userSubscription: null,
    usuario: null,
    createSubscription: () => Promise.resolve(),
    cancelSubscription: () => Promise.resolve()
  };
};

export default useSubscriptions;