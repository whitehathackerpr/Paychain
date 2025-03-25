import { Principal } from '@dfinity/principal';

export interface GenericPrincipal {
  toText: () => string;
  raw: Uint8Array;
  toBlob: () => Uint8Array;
}

/**
 * Convert a Principal to a GenericPrincipal
 * This is necessary because the Principal types from different module versions are incompatible
 */
export const toGenericPrincipal = (principal: Principal): GenericPrincipal => {
  return {
    toText: () => principal.toText(),
    raw: principal.toUint8Array(),
    toBlob: () => principal.toUint8Array()
  };
};

/**
 * Create a GenericPrincipal from a string
 */
export const createGenericPrincipal = (text: string): GenericPrincipal => {
  const principal = Principal.fromText(text);
  return {
    toText: () => principal.toText(),
    raw: principal.toUint8Array(),
    toBlob: () => principal.toUint8Array()
  };
}; 