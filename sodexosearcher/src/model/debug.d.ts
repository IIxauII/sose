import { LogLevel } from "./enums/debug";

export interface LogToDebugPayload {
    time: string;
    logLevel: LogLevel;
    initiator: string;
    caller: string;
    message: string;
}

export type LogToDebugArguments = [logLevel: LogLevel, initiator: string, caller: string, message: string];