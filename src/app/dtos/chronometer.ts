export type Chronometer = {
    id: number;
    seconds: number;
    parts: ChronometerPart[]
}

export type ChronometerPart = {
    id?: number;
    seconds: number;
    description: string;
}