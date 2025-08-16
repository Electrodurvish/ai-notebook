import mongoose, { Document } from "mongoose";
export interface ISummary extends Document {
    filename: string;
    summary: string;
    originalText?: string;
    customPrompt?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ISummary, {}, {}, {}, mongoose.Document<unknown, {}, ISummary, {}, {}> & ISummary & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Summary.d.ts.map