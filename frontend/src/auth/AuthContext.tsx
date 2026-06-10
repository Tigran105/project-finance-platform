import { useApolloClient, useQuery } from "@apollo/client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { ME_QUERY } from "@/graphql/queries/auth";
import type { AuthPayload, User } from "@/types/auth";

import { clearAuthToken, getAuthToken, setAuthToken } from "./token";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (payload: AuthPayload) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const apolloClient = useApolloClient();
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  const hasToken = Boolean(token);

  const { data, loading } = useQuery<{ me: User | null }>(ME_QUERY, {
    skip: !hasToken,
    fetchPolicy: "network-only",
  });

  const setSession = useCallback((payload: AuthPayload) => {
    setAuthToken(payload.token);
    setToken(payload.token);
    apolloClient.writeQuery({
      query: ME_QUERY,
      data: { me: payload.user },
    });
  }, [apolloClient]);

  const logout = useCallback(() => {
    clearAuthToken();
    setToken(null);
    void apolloClient.clearStore();
  }, [apolloClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: hasToken ? (data?.me ?? null) : null,
      isAuthenticated: hasToken && Boolean(data?.me),
      isLoading: hasToken && loading,
      setSession,
      logout,
    }),
    [data?.me, hasToken, loading, logout, setSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
