"use server";

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, parseStringify } from "../utils";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import { plaidClient } from "../plaid";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

const stripe = new Stripe("", {
  apiVersion: "2024-06-20",
});

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();

    const response = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", response.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(response);
  } catch (error) {
    console.error("Error", error);
  }
};

export const signUp = async (userData: SignUpParams) => {
  const { email, password, firstName, lastName } = userData;

  try {
    const { account } = await createAdminClient();

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    const session = await account.createEmailPasswordSession(email, password);

    await cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUserAccount);
  } catch (error) {
    console.error("Error", error);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();

    return parseStringify(user);
  } catch (error) {
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    await cookies().delete("appwrite-session");

    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: user.name,
      products: ["auth"] as Products[],
      language: "pt",
      country_codes: ["PT"] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.log(error);
  }
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    //     // Create a processor token for Dwolla using the access token and account ID
    //     const request: ProcessorTokenCreateRequest = {
    //       access_token: accessToken,
    //       account_id: accountData.account_id,
    //       processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    //     };

    //     const processorTokenResponse =
    //       await plaidClient.processorTokenCreate(request);
    //     const processorToken = processorTokenResponse.data.processor_token;

    //     // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    //     const fundingSourceUrl = await addFundingSource({
    //       dwollaCustomerId: user.dwollaCustomerId,
    //       processorToken,
    //       bankName: accountData.name,
    //     });

    //     // If the funding source URL is not created, throw an error
    //     if (!fundingSourceUrl) throw Error;

    //     // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and sharable ID
    //     await createBankAccount({
    //       userId: user.$id,
    //       bankId: itemId,
    //       accountId: accountData.account_id,
    //       accessToken,
    //       fundingSourceUrl,
    //       sharableId: encryptId(accountData.account_id),
    //     });

    //     // Revalidate the path to reflect the changes
    //     revalidatePath("/");

    //     // Return a success message
    //     return parseStringify({
    //       publicTokenExchange: "complete",
    //     });
    //   } catch (error) {
    //     // Log any errors that occur during the process
    //     console.error("An error occurred while creating exchanging token:", error);
    //   }
    // };
    // Create a bank account token for Stripe using the access token and account ID
    // const bankAccountToken = await stripe.tokens.create({
    //   bank_account: {
    //     country: "PT",
    //     currency: "eur",
    //     account_holder_name: accountData.name,
    //     account_holder_type: "individual",
    //     routing_number: accountData.routing_numbers.ach,
    //     account_number: accountData.account_id,
    //   },
    // });

    // // Create a funding source URL for the account using the Stripe customer ID and bank account token
    // const fundingSourceUrl = await addFundingSource({
    //   stripeCustomerId: user.stripeCustomerId,
    //   bankAccountToken: bankAccountToken.id,
    //   bankName: accountData.name,
    // });

    // If the funding source URL is not created, throw an error
    // if (!fundingSourceUrl) throw Error;

    // // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and sharable ID
    // await createBankAccount({
    //   userId: user.$id,
    //   bankId: itemId,
    //   accountId: accountData.account_id,
    //   accessToken,
    //   fundingSourceUrl,
    //   sharableId: encryptId(accountData.account_id),
    // });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    // Log any errors that occur during the process
    console.error("An error occurred while creating exchanging token:", error);
  }
};
