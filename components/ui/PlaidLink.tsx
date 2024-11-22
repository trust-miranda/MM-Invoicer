import React, { useCallback, useEffect, useState } from "react";
import { Button } from "./button";
import {
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
  usePlaidLink,
} from "react-plaid-link";
import { useRouter } from "next/navigation";
import { createLinkToken } from "@/lib/actions/user.actions";

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter();

  const [token, setToken] = useState("");

  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user);
      setToken(data?.linkToken);
    };
    getLinkToken();
  }, [user]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      // await exchangePublicToken({
      //     publicToken: public_token,
      //     user,
      // })

      router.push("/");
    },
    [user]
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <>
      {variant === "primary" ? (
        <Button
          onClick={() => {
            open;
          }}
          disabled={!ready}
          className="plaidlink-primary"
        >
          Associar Banco
        </Button>
      ) : variant === "ghost" ? (
        <Button>Associar Banco</Button>
      ) : (
        <Button>Associar Banco</Button>
      )}
    </>
  );
};

export default PlaidLink;
