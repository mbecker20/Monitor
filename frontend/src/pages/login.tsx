import { Button } from "@ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/card";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { useAuth, useLoginOptions, useUserInvalidate } from "@lib/hooks";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@ui/theme";
import { AUTH_TOKEN_STORAGE_KEY, MONITOR_BASE_URL } from "@main";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

type OauthProvider = "Github" | "Google";

const login_with_oauth = (provider: OauthProvider) => {
  const redirect = encodeURIComponent(location.href);
  location.replace(
    `${MONITOR_BASE_URL}/auth/${provider.toLowerCase()}/login?redirect=${redirect}`
  );
};

const sanitize_query = (search: URLSearchParams) => {
  search.delete("token");
  const query = search.toString();
  location.replace(
    `${location.origin}${location.pathname}${query.length ? "?" + query : ""}`
  );
}

/// returns whether to show login / loading screen depending on state of exchange token loop
const useExchangeToken = () => {
  const search = new URLSearchParams(location.search);
  const exchange_token = search.get("token");
  const { mutate, isPending } = useAuth("ExchangeForJwt", {
    onSuccess: ({ jwt }) => {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, jwt);
      sanitize_query(search);
    },
    onError: (e) => {
      console.log("exchange token for jwt error:", e);
      sanitize_query(search);
    }
  });
  if (!exchange_token) return false;
  mutate({ token: exchange_token });
  return isPending;
};

export const Login2 = () => {
  // const exchange_token =
  const options = useLoginOptions().data;
  const [creds, set] = useState({ username: "", password: "" });
  const userInvalidate = useUserInvalidate();
  const onSuccess = ({ jwt }: { jwt: string }) => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, jwt);
    userInvalidate();
  };
  const { mutate: signup, isPending: signupPending } = useAuth(
    "CreateLocalUser",
    {
      onSuccess,
    }
  );
  const { mutate: login, isPending: loginPending } = useAuth("LoginLocalUser", {
    onSuccess,
  });
  const exchangeTokenPending = useExchangeToken();
  if (exchangeTokenPending) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-7 animate-spin" />
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container flex justify-end items-center h-16">
        <ThemeToggle />
      </div>
      <div className="flex justify-center items-center container mt-32">
        <Card className="w-full max-w-[500px] place-self-center">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-xl">Monitor</CardTitle>
            <div className="flex gap-2">
              {(
                [
                  [options?.google, "Google"],
                  [options?.github, "Github"],
                ] as Array<[boolean | undefined, OauthProvider]>
              ).map(
                ([enabled, provider]) =>
                  enabled && (
                    <Button
                      key={provider}
                      variant="outline"
                      className="flex gap-2 px-3 items-center"
                      onClick={() => login_with_oauth(provider)}
                    >
                      {provider}
                      <img
                        src={`/icons/${provider.toLowerCase()}.svg`}
                        alt={provider}
                        className="w-4 h-4"
                      />
                    </Button>
                  )
              )}
            </div>
          </CardHeader>
          {options?.local && (
            <>
              <CardContent className="flex flex-col justify-center w-full gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={creds.username}
                    onChange={({ target }) =>
                      set((c) => ({ ...c, username: target.value }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={creds.password}
                    onChange={({ target }) =>
                      set((c) => ({ ...c, password: target.value }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && login(creds)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex gap-4 w-full justify-end">
                <Button
                  variant="outline"
                  onClick={() => signup(creds)}
                  disabled={signupPending}
                >
                  Sign Up
                </Button>
                <Button
                  variant="default"
                  onClick={() => login(creds)}
                  disabled={loginPending}
                >
                  Log In
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};
