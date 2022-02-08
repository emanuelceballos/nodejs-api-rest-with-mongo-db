import { AsyncLocalStorage } from "async_hooks";
import { Logger } from "tslog";

const asyncLocalStorage: AsyncLocalStorage<{ requestId: string }> =
    new AsyncLocalStorage();

const logger: Logger = new Logger({
    name: "Server",
    displayFunctionName: false,
    displayLoggerName: false,
    displayFilePath: "hidden",
    requestId: (): string => {
        return asyncLocalStorage.getStore()?.requestId as string;
    },
});

export { logger, asyncLocalStorage };
