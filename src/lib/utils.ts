import { clsx, type ClassValue } from "clsx";
import { getCookie as getCookieNext } from 'cookies-next';
import { jwtVerify } from "jose";
import { NextApiRequest, NextApiResponse } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getAuthToken = (): string | undefined => {
  return getCookieNext('authToken') as string | undefined;
};

export const authenticate = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<boolean> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Unauthorized: Missing authorization header' });
    return false;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Unauthorized: Missing token' });
    return false;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '5322c9714a5e9451e84e9f4da58074b4d2af21cb9bafa65a2bbdf8de9f95e5b3');
    await jwtVerify(token, secret, { algorithms: ['HS256'] });
    return true;
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
    return false;
  }
};