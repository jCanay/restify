export const getAuthStatus = (token, user, account) => {
  const authenticated = !!token

  const isManager =
    user?.role?.name === "ROLE_ADMIN" || user?.role?.name === "ROLE_OWNER"
  const needsOnboarding =
    authenticated && isManager && !account?.onboardingCompleted

  return {
    authenticated,
    needsOnboarding,
    isManager,
  }
}
