import { Principal } from '@dfinity/principal';
import { GenericPrincipal } from '../declarations/PayChain_backend';

/**
 * Convert a Principal to a GenericPrincipal
 * This is necessary because the Principal types from different module versions are incompatible
 */
export const toGenericPrincipal = (principal: any): GenericPrincipal => {
  // Using 'any' to bypass TypeScript's strict type checking for different Principal versions
  return {
    toText: () => principal.toText(),
    fromText: (text: string) => createGenericPrincipal(text)
  };
};

/**
 * Create a GenericPrincipal from a string
 */
export const createGenericPrincipal = (text: string): GenericPrincipal => {
  // Using 'any' to bypass TypeScript's strict type checking for different Principal versions
  const principal: any = Principal.fromText(text);
  return {
    toText: () => principal.toText(),
    fromText: (t: string) => createGenericPrincipal(t)
  };
}; 