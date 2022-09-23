import { Dispatcher } from "undici";

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