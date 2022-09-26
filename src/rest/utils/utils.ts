import { Blob, Buffer } from 'node:buffer';
import { URLSearchParams } from 'node:url';
import { types } from 'node:util';
import { type Dispatcher, type RequestInit, FormData } from 'undici';
import type { RequestOptions } from '../REST.js';

export function parseHeader(header: string[] | string | undefined): string | undefined {
    if (header === undefined || typeof header === 'string') {
        return header;
    }
    return header.join(';');
}

/**
 * Converts the response to a usable data format
 * @param response - The request response
 */
export async function parseResponse(response: Dispatcher.ResponseData): Promise<unknown> {
    const header = parseHeader(response.headers['content-type']);
    if (header?.startsWith('application/json')) {
        return response.body.json();
    }
    return response.body.arrayBuffer();
}

export async function resolveBody(body: RequestInit['body']): Promise<RequestOptions['body']> {
    if (body == null) {
        return null;
    } else if (typeof body === 'string') {
        return body;
    } else if (types.isUint8Array(body)) {
        return body;
    } else if (types.isArrayBuffer(body)) {
        return new Uint8Array(body);
    } else if (body instanceof URLSearchParams) {
        return body.toString();
    } else if (body instanceof DataView) {
        return new Uint8Array(body.buffer);
    } else if (body instanceof Blob) {
        return new Uint8Array(await body.arrayBuffer());
    } else if (body instanceof FormData) {
        return body;
    } else if ((body as Iterable<Uint8Array>)[Symbol.iterator]) {
        const chunks = [...(body as Iterable<Uint8Array>)];
        const length = chunks.reduce((a, b) => a + b.length, 0);

        const uint8 = new Uint8Array(length);
        let lengthUsed = 0;

        return chunks.reduce((a, b) => {
            a.set(b, lengthUsed);
            lengthUsed += b.length;
            return a;
        }, uint8);
    } else if ((body as AsyncIterable<Uint8Array>)[Symbol.asyncIterator]) {
        const chunks: Uint8Array[] = [];

        for await (const chunk of body as AsyncIterable<Uint8Array>) {
            chunks.push(chunk);
        }

        return Buffer.concat(chunks);
    }

    throw new TypeError('Unable to resolve body.');
}