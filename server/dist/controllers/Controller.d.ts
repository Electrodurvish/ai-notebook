import { Request, Response } from "express";
export declare const uploadSummary: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getSummaries: (_req: Request, res: Response) => Promise<void>;
export declare const shareSummary: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateSummary: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteSummary: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=Controller.d.ts.map