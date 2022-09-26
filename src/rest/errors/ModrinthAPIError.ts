import {InternalRequest} from "../RequestManager.js";


interface ModrinthErrorFieldInformation {
    code: string;
    message: string;
}

interface ModrinthErrorGroupWrapper {
    _errors: ModrinthError[];
}

type ModrinthError = ModrinthErrorFieldInformation | ModrinthErrorGroupWrapper | string | { [k: string]: ModrinthError };

export interface ModrinthErrorData {
    code: number;
    errors?: ModrinthError;
    message: string;
}

export interface OAuthErrorData {
    error: string;
    error_description?: string;
}

export interface RequestBody {
    files: RawFile[] | undefined;
    json: unknown | undefined;
}

function isErrorGroupWrapper(error: ModrinthError): error is ModrinthErrorGroupWrapper {
    return Reflect.has(error as Record<string, unknown>, '_errors');
}

function isErrorResponse(error: ModrinthError): error is ModrinthErrorFieldInformation {
    return typeof Reflect.get(error as Record<string, unknown>, 'message') === 'string';
}

/**
 * Represents an API error returned by Modrinth
 */
export class ModrinthAPIError extends Error {
    public requestBody: RequestBody;

    /**
     * @param rawError - The error reported by Modrinth
     * @param code - The error code reported by Modrinth
     * @param status - The status code of the response
     * @param method - The method of the request the erred
     * @param url - The url of the request that erred
     * @param bodyData - The unparsed data for the request the erred
     */
    public constructor(
        public rawError: ModrinthErrorData | OAuthErrorData,
        public code: number | string,
        public status: number,
        public method: string,
        public url: string,
        bodyData: Pick<InternalRequest, 'body' | 'files'>,
    ) {
        super(ModrinthAPIError.getMessage(rawError));

        this.requestBody = { files: bodyData.files, json: bodyData.body };
    }

    /**
     * The name of the error
     */
    public override get name(): string {
        return `${ModrinthAPIError.name}[${this.code}]`;
    }

    private static getMessage(error: ModrinthErrorData | OAuthErrorData) {
        let flattened
    }
}