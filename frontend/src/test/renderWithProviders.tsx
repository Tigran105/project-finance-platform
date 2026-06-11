import { ApolloProvider, InMemoryCache, type MockedResponse } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { MemoryRouter, type MemoryRouterProps } from "react-router-dom";

import { AuthProvider } from "../auth/AuthContext";
import { theme } from "../theme";

type RenderWithProvidersOptions = Omit<RenderOptions, "wrapper"> & {
  route?: string;
  routerProps?: MemoryRouterProps;
  mocks?: MockedResponse[];
  useMockedProvider?: boolean;
};

function AllProviders({
  children,
  route = "/",
  routerProps,
  mocks = [],
  useMockedProvider = true,
}: {
  children: ReactNode;
  route?: string;
  routerProps?: MemoryRouterProps;
  mocks?: MockedResponse[];
  useMockedProvider?: boolean;
}) {
  const apolloWrapper = useMockedProvider ? (
    <MockedProvider mocks={mocks}>{children}</MockedProvider>
  ) : (
    <ApolloProvider client={new InMemoryCache()}>{children}</ApolloProvider>
  );

  return (
    <MemoryRouter initialEntries={[route]} {...routerProps}>
      {apolloWrapper}
    </MemoryRouter>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  {
    route = "/",
    routerProps,
    mocks = [],
    useMockedProvider = true,
    ...renderOptions
  }: RenderWithProvidersOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AllProviders
          route={route}
          routerProps={routerProps}
          mocks={mocks}
          useMockedProvider={useMockedProvider}
        >
          <AuthProvider>{children}</AuthProvider>
        </AllProviders>
      </ThemeProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export function renderWithTheme(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    ),
    ...options,
  });
}
