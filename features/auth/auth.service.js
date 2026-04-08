import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { supabase } from "./supabase.client";

WebBrowser.maybeCompleteAuthSession();

const AUTH_CALLBACK_PATH = "auth/callback";

function getRedirectUrl() {
  return process.env.EXPO_PUBLIC_SUPABASE_REDIRECT_URL ?? Linking.createURL(AUTH_CALLBACK_PATH);
}

function readSessionFromUrl(url) {
  const { queryParams } = Linking.parse(url);

  const accessToken = queryParams?.access_token;
  const refreshToken = queryParams?.refresh_token;
  const code = queryParams?.code;
  const errorDescription = queryParams?.error_description;
  const errorCode = queryParams?.error_code;

  return {
    accessToken: typeof accessToken === "string" ? accessToken : null,
    refreshToken: typeof refreshToken === "string" ? refreshToken : null,
    code: typeof code === "string" ? code : null,
    errorDescription: typeof errorDescription === "string" ? errorDescription : null,
    errorCode: typeof errorCode === "string" ? errorCode : null,
  };
}

async function finalizeOAuthSession(callbackUrl) {
  const { accessToken, refreshToken, code, errorCode, errorDescription } = readSessionFromUrl(callbackUrl);

  if (errorCode || errorDescription) {
    throw new Error(errorDescription ?? errorCode ?? "OAuth sign-in failed.");
  }

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return data;
  }

  if (accessToken && refreshToken) {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) throw error;
    return data;
  }

  return null;
}

export async function signUpWithEmail({ email, password, fullName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getRedirectUrl(),
      data: {
        full_name: fullName ?? null,
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signInWithPassword({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const redirectTo = getRedirectUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      scopes: "email profile",
      skipBrowserRedirect: Platform.OS !== "web",
    },
  });

  if (error) throw error;

  if (Platform.OS === "web") {
    return data;
  }

  if (!data?.url) {
    throw new Error("Supabase did not return an OAuth URL.");
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type === "dismiss" || result.type === "cancel") {
    return null;
  }

  if (result.type !== "success" || !result.url) {
    throw new Error("Google sign-in did not complete successfully.");
  }

  return finalizeOAuthSession(result.url);
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getRedirectUrl(),
  });
  if (error) throw error;
  return data;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}
